import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { BULK_TEMPLATES, threadKey } from '../appConstants';

export default function useAdminThreads({ isAdmin, adminUnreadByThread, setStatus, selectRows, insertRows, updateRows, recordEngagement }) {
  const [incomingThreads, setIncomingThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [adminReply, setAdminReply] = useState('');
  const [threadMessages, setThreadMessages] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedThreadKeys, setSelectedThreadKeys] = useState({});
  const [bulkTemplate, setBulkTemplate] = useState(BULK_TEMPLATES[0]);
  const [threadOpsByKey, setThreadOpsByKey] = useState({});
  const [threadTimeline, setThreadTimeline] = useState([]);
  const [threadFilter, setThreadFilter] = useState({ waitingOnly: false, slaRisk: false, unassigned: false, blacklist: false });
  const [threadSortMode, setThreadSortMode] = useState('sla_unread_recent');
  const [bulkPriority, setBulkPriority] = useState('');
  const [bulkAssignTo, setBulkAssignTo] = useState('');
  const [bulkFollowUpDate, setBulkFollowUpDate] = useState('');
  const [bulkBlacklistMode, setBulkBlacklistMode] = useState('ignore');
  const [bulkStatusTag, setBulkStatusTag] = useState('');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  async function fetchIncomingThreads() {
    try {
      const data = await selectRows('admin_threads', (q) => q.order('last_message_at', { ascending: false }));
      setIncomingThreads(data || []);
    } catch (error) { setStatus(error.message); }
  }

  async function fetchThreadOperations() {
    if (!isAdmin) return;
    const { data, error } = await supabase
      .from('thread_events')
      .select('member_id, virtual_profile_id, event_type, meta, created_at')
      .order('created_at', { ascending: true })
      .limit(1000);
    if (error) return;

    const ops = {};
    const selectedKey = selectedThread ? threadKey(selectedThread.member_id, selectedThread.virtual_profile_id) : null;
    const timelineRows = [];

    (data || []).forEach((row) => {
      const key = threadKey(row.member_id, row.virtual_profile_id);
      if (!ops[key]) ops[key] = {};
      if (row.event_type === 'thread_ops_update') {
        ops[key] = { ...ops[key], ...(row.meta || {}) };
      }
      if (selectedKey && key === selectedKey && ['status_change', 'bulk_sent', 'admin_reply', 'thread_ops_update'].includes(row.event_type)) {
        timelineRows.push(row);
      }
    });

    setThreadOpsByKey(ops);
    if (selectedKey) setThreadTimeline(timelineRows.slice(-20).reverse());
  }

  async function applyBulkThreadOps() {
    const selectedKeys = Object.keys(selectedThreadKeys).filter((k) => selectedThreadKeys[k]);
    if (!selectedKeys.length) return setStatus('Önce thread seçmelisin.');
    const payload = {};
    if (bulkPriority) payload.priority = bulkPriority;
    if (bulkAssignTo.trim()) payload.assigned_admin = bulkAssignTo.trim();
    if (bulkFollowUpDate) payload.follow_up_at = `${bulkFollowUpDate}T09:00:00.000Z`;
    if (bulkBlacklistMode !== 'ignore') payload.blacklisted = bulkBlacklistMode === 'true';
    if (bulkStatusTag) payload.status_tag = bulkStatusTag;
    if (!Object.keys(payload).length) return setStatus('Toplu işlem için en az bir alan seç.');

    const rows = selectedKeys.map((key) => {
      const [member_id, virtual_profile_id] = key.split('::');
      return { member_id, virtual_profile_id, event_type: 'thread_ops_update', meta: payload };
    });
    try {
      await insertRows('thread_events', rows);
      if (bulkStatusTag) {
        await Promise.all(selectedKeys.map(async (key) => {
          const [member_id, virtual_profile_id] = key.split('::');
          await updateRows('admin_threads', { status_tag: bulkStatusTag }, (q) => q.eq('member_id', member_id).eq('virtual_profile_id', virtual_profile_id));
        }));
      }
      setStatus(`${rows.length} thread için operasyon güncellendi.`);
      fetchIncomingThreads();
      fetchThreadOperations();
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function fetchThreadMessages(memberId, profileId) {
    const { data, error } = await supabase.from('messages').select('*').eq('member_id', memberId).eq('virtual_profile_id', profileId).order('created_at', { ascending: true });
    if (error) return setStatus(error.message);
    setThreadMessages(data || []);
    await supabase.from('messages').update({ seen_by_admin: true, seen_by_admin_at: new Date().toISOString() }).eq('member_id', memberId).eq('virtual_profile_id', profileId).eq('sender_role', 'member').eq('seen_by_admin', false);
  }

  async function sendAdminReply() {
    if (!selectedThread || !adminReply.trim()) return;
    setStatus('');

    const { error } = await supabase.from('messages').insert({
      member_id: selectedThread.member_id, virtual_profile_id: selectedThread.virtual_profile_id, sender_role: 'virtual', content: adminReply.trim(), seen_by_member: false, seen_by_admin: true,
    });
    if (error) return setStatus(error.message);
    try {
      await insertRows('thread_events', { member_id: selectedThread.member_id, virtual_profile_id: selectedThread.virtual_profile_id, event_type: 'admin_reply', meta: { preview: adminReply.trim().slice(0, 80) } });
    } catch {}
    recordEngagement('admin_reply', selectedThread.member_id, selectedThread.virtual_profile_id, { source: 'admin_reply' });
    setAdminReply(''); setAiSuggestions([]); fetchIncomingThreads(); fetchThreadMessages(selectedThread.member_id, selectedThread.virtual_profile_id);
    setStatus('Yanıt gönderildi.');
  }

  async function updateSelectedThreadTag(tag) {
    if (!selectedThread) return;
    try {
      await updateRows('admin_threads', { status_tag: tag }, (q) => q.eq('member_id', selectedThread.member_id).eq('virtual_profile_id', selectedThread.virtual_profile_id));
      await insertRows('thread_events', { member_id: selectedThread.member_id, virtual_profile_id: selectedThread.virtual_profile_id, event_type: 'status_change', meta: { status_tag: tag } });
    } catch (error) { return setStatus(error.message); }
    setSelectedThread((prev) => (prev ? { ...prev, status_tag: tag } : prev));
    fetchIncomingThreads();
  }

  async function sendBulkTemplate() {
    const selectedKeys = Object.keys(selectedThreadKeys).filter((k) => selectedThreadKeys[k]);
    if (!selectedKeys.length) return setStatus('Önce en az bir thread seç.');
    if (!bulkTemplate.trim()) return;

    const rows = selectedKeys.map((key) => {
      const [member_id, virtual_profile_id] = key.split('::');
      return { member_id, virtual_profile_id, sender_role: 'virtual', content: bulkTemplate, seen_by_member: false, seen_by_admin: true };
    });

    try {
      await insertRows('messages', rows);
      await insertRows('thread_events', rows.map((row) => ({ member_id: row.member_id, virtual_profile_id: row.virtual_profile_id, event_type: 'bulk_sent', meta: { template: bulkTemplate } })));
    } catch (error) { return setStatus(error.message); }
    setSelectedThreadKeys({}); setStatus(`${rows.length} thread için bulk mesaj gönderildi.`); fetchIncomingThreads();
  }

  async function fetchAiSuggestions() {
    if (!selectedThread || !threadMessages.length) return;
    const lastMemberMessage = [...threadMessages].reverse().find((m) => m.sender_role === 'member')?.content;
    if (!lastMemberMessage) return;

    setLoadingSuggestions(true); setStatus('');
    const prompt = `Kullanıcı mesajı: "${lastMemberMessage}". Flört uygulaması için 3 kısa ve doğal Türkçe cevap öner.`;
    try {
      const res = await fetch('/api/ai-suggest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }),
      });
      setLoadingSuggestions(false);
      const data = await res.json();
      if (!res.ok || !data.ok) return setStatus(`AI önerisi alınamadı: ${data.error || 'hata'}`);
      setAiSuggestions((data.output_text || '').split('\n').map((l) => l.replace(/^\d+[\).\-]\s*/, '').trim()).filter(Boolean).slice(0, 3));
    } catch (err) {
      setLoadingSuggestions(false);
      setStatus('AI önerisi alınamadı.');
    }
  }

  useEffect(() => {
    if (!isAdmin || selectedThread || !incomingThreads.length) return;
    setSelectedThread(incomingThreads[0]);
  }, [isAdmin, selectedThread, incomingThreads]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (!isAdmin) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAdmin]);

  return {
    incomingThreads, setIncomingThreads,
    selectedThread, setSelectedThread,
    adminReply, setAdminReply,
    threadMessages, setThreadMessages,
    aiSuggestions, setAiSuggestions,
    loadingSuggestions, setLoadingSuggestions,
    selectedThreadKeys, setSelectedThreadKeys,
    bulkTemplate, setBulkTemplate,
    threadOpsByKey, setThreadOpsByKey,
    threadTimeline, setThreadTimeline,
    threadFilter, setThreadFilter,
    threadSortMode, setThreadSortMode,
    bulkPriority, setBulkPriority,
    bulkAssignTo, setBulkAssignTo,
    bulkFollowUpDate, setBulkFollowUpDate,
    bulkBlacklistMode, setBulkBlacklistMode,
    bulkStatusTag, setBulkStatusTag,
    commandPaletteOpen, setCommandPaletteOpen,
    fetchIncomingThreads,
    fetchThreadOperations,
    applyBulkThreadOps,
    fetchThreadMessages,
    sendAdminReply,
    updateSelectedThreadTag,
    sendBulkTemplate,
    fetchAiSuggestions,
  };
}
