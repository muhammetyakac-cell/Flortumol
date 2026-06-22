import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { buildStatsSnapshot } from '../appConstants';

export default function useAdminStats({ isAdmin, adminTab, incomingThreads, threadMessages, virtualProfiles, profileById, setStatus }) {
  const [engagementInsights, setEngagementInsights] = useState({ topHours: [], topProfiles: [] });
  const [adminStats, setAdminStats] = useState({
    totalMessagesToday: 0, memberMessagesToday: 0, adminRepliesToday: 0, respondedThreadsToday: 0,
    newMembersToday: 0, activeThreadsToday: 0, avgResponseMinToday: 0,
  });
  const [previousAdminStats, setPreviousAdminStats] = useState({
    totalMessagesToday: 0, memberMessagesToday: 0, adminRepliesToday: 0, respondedThreadsToday: 0,
    newMembersToday: 0, activeThreadsToday: 0, avgResponseMinToday: 0,
  });
  const [statsAlerts, setStatsAlerts] = useState([]);
  const [statsRange, setStatsRange] = useState('daily');
  const [statsDateRange, setStatsDateRange] = useState({ from: '', to: '' });

  async function fetchEngagementInsights() {
    if (!isAdmin) return;
    const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString();
    let rows = [];

    const events = await supabase.from('engagement_events').select('created_at, virtual_profile_id, event_type').eq('event_type', 'member_message').gte('created_at', since);
    if (!events.error && events.data?.length) { rows = events.data; } 
    else {
      const fallback = await supabase.from('messages').select('created_at, virtual_profile_id, sender_role').eq('sender_role', 'member').gte('created_at', since);
      rows = (fallback.data || []).map((r) => ({ ...r, event_type: 'member_message' }));
    }

    const hourMap = new Map();
    const profileMap = new Map();
    rows.forEach((row) => {
      const d = new Date(row.created_at);
      const h = Number.isNaN(d.getTime()) ? 0 : d.getHours();
      hourMap.set(h, (hourMap.get(h) || 0) + 1);
      profileMap.set(row.virtual_profile_id, (profileMap.get(row.virtual_profile_id) || 0) + 1);
    });

    const topHours = [...hourMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([hour, count]) => ({ label: `${String(hour).padStart(2, '0')}:00`, count }));
    const topProfiles = [...profileMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([profileId, count]) => ({ name: profileById[profileId]?.name || 'Bilinmeyen Profil', count }));
    setEngagementInsights({ topHours, topProfiles });
  }

  async function fetchAdminStats() {
    if (!isAdmin) return;
    const end = statsDateRange.to ? new Date(`${statsDateRange.to}T23:59:59.999Z`) : new Date();
    const start = statsDateRange.from
      ? new Date(`${statsDateRange.from}T00:00:00.000Z`)
      : (() => {
          const d = new Date();
          if (statsRange === 'daily') d.setHours(0, 0, 0, 0);
          else if (statsRange === 'weekly') d.setDate(d.getDate() - 7);
          else d.setMonth(d.getMonth() - 1);
          return d;
        })();

    const periodMs = Math.max(end.getTime() - start.getTime(), 3600000);
    const prevEnd = new Date(start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - periodMs);

    const [
      { data: currentMessages, error: msgErr1 },
      { data: currentMembers, error: memErr1 },
      { data: prevMessages, error: msgErr2 },
      { data: prevMembers, error: memErr2 },
    ] = await Promise.all([
      supabase.from('messages').select('member_id, virtual_profile_id, sender_role, created_at').gte('created_at', start.toISOString()).lte('created_at', end.toISOString()),
      supabase.from('members').select('id, created_at').gte('created_at', start.toISOString()).lte('created_at', end.toISOString()),
      supabase.from('messages').select('member_id, virtual_profile_id, sender_role, created_at').gte('created_at', prevStart.toISOString()).lte('created_at', prevEnd.toISOString()),
      supabase.from('members').select('id, created_at').gte('created_at', prevStart.toISOString()).lte('created_at', prevEnd.toISOString()),
    ]);

    if (msgErr1 || memErr1 || msgErr2 || memErr2) return setStatus(msgErr1?.message || memErr1?.message || msgErr2?.message || memErr2?.message || 'Stats alınamadı.');

    const currentSnapshot = buildStatsSnapshot(currentMessages || [], currentMembers || []);
    const prevSnapshot = buildStatsSnapshot(prevMessages || [], prevMembers || []);
    setAdminStats(currentSnapshot);
    setPreviousAdminStats(prevSnapshot);

    const alerts = [];
    if (currentSnapshot.avgResponseMinToday > 7) alerts.push('⚠️ Ortalama cevap süresi 7 dk üzerinde.');
    if (currentSnapshot.respondedThreadsToday < Math.max(1, Math.floor(currentSnapshot.activeThreadsToday * 0.5))) alerts.push('⚠️ Cevaplanan thread oranı düşük görünüyor.');
    if (currentSnapshot.memberMessagesToday > 0 && currentSnapshot.adminRepliesToday === 0) alerts.push('⚠️ Üye mesajı var ama admin cevabı yok.');
    setStatsAlerts(alerts);
  }

  function exportStatsCsv() {
    function pctChange(current, previous) {
      if (!previous) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    }
    const rows = [
      ['metric', 'current', 'previous', 'pct_change'],
      ['total_messages', adminStats.totalMessagesToday, previousAdminStats.totalMessagesToday, pctChange(adminStats.totalMessagesToday, previousAdminStats.totalMessagesToday).toFixed(1)],
      ['member_messages', adminStats.memberMessagesToday, previousAdminStats.memberMessagesToday, pctChange(adminStats.memberMessagesToday, previousAdminStats.memberMessagesToday).toFixed(1)],
      ['admin_replies', adminStats.adminRepliesToday, previousAdminStats.adminRepliesToday, pctChange(adminStats.adminRepliesToday, previousAdminStats.adminRepliesToday).toFixed(1)],
      ['responded_threads', adminStats.respondedThreadsToday, previousAdminStats.respondedThreadsToday, pctChange(adminStats.respondedThreadsToday, previousAdminStats.respondedThreadsToday).toFixed(1)],
      ['new_members', adminStats.newMembersToday, previousAdminStats.newMembersToday, pctChange(adminStats.newMembersToday, previousAdminStats.newMembersToday).toFixed(1)],
      ['active_threads', adminStats.activeThreadsToday, previousAdminStats.activeThreadsToday, pctChange(adminStats.activeThreadsToday, previousAdminStats.activeThreadsToday).toFixed(1)],
      ['avg_response_min', adminStats.avgResponseMinToday.toFixed(2), previousAdminStats.avgResponseMinToday.toFixed(2), pctChange(adminStats.avgResponseMinToday, previousAdminStats.avgResponseMinToday).toFixed(1)],
    ];
    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flort_stats_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    if (!isAdmin || adminTab !== 'stats') return;
    fetchAdminStats();
  }, [isAdmin, adminTab, incomingThreads, threadMessages, statsRange, statsDateRange.from, statsDateRange.to]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchEngagementInsights();
  }, [isAdmin, incomingThreads, virtualProfiles]);

  return {
    engagementInsights, setEngagementInsights,
    adminStats, setAdminStats,
    previousAdminStats, setPreviousAdminStats,
    statsAlerts, setStatsAlerts,
    statsRange, setStatsRange,
    statsDateRange, setStatsDateRange,
    fetchEngagementInsights,
    fetchAdminStats,
    exportStatsCsv,
  };
}
