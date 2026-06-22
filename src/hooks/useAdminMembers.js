import { useState } from 'react';
import { supabase } from '../supabase';

export default function useAdminMembers({ threads, setStatus, setAdminTab }) {
  const [quickFactsText, setQuickFactsText] = useState('');
  const [registeredMembers, setRegisteredMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedMemberProfile, setSelectedMemberProfile] = useState(null);
  const [selectedAdminMember, setSelectedAdminMember] = useState(null);
  const [adminMemberDetailOpen, setAdminMemberDetailOpen] = useState(false);
  const [adminMemberThreads, setAdminMemberThreads] = useState([]);
  const [adminMemberMessageCount, setAdminMemberMessageCount] = useState(0);
  const [savingMemberDetail, setSavingMemberDetail] = useState(false);
  const [memberModeration, setMemberModeration] = useState({ note: '', tags: '', blacklisted: false });

  async function fetchQuickFacts(memberId, profileId) {
    const { data, error } = await supabase.from('thread_quick_facts').select('notes').eq('member_id', memberId).eq('virtual_profile_id', profileId).maybeSingle();
    if (!error) setQuickFactsText(data?.notes || '');
  }

  async function fetchMemberProfile(memberId) {
    const { data, error } = await supabase.from('member_profiles').select('age, hobbies, city, photo_url, status_emoji').eq('member_id', memberId).maybeSingle();
    setSelectedMemberProfile(error ? null : (data || null));
  }

  async function fetchMemberModeration(memberId) {
    const { data, error } = await supabase.from('member_moderation').select('notes, tags, is_blacklisted').eq('member_id', memberId).maybeSingle();
    setMemberModeration(error ? { note: '', tags: '', blacklisted: false } : { note: data?.notes || '', tags: (data?.tags || []).join(', '), blacklisted: !!data?.is_blacklisted });
  }

  async function saveMemberModeration() {
    if (!threads.selectedThread) return;
    const payload = { member_id: threads.selectedThread.member_id, notes: memberModeration.note, tags: memberModeration.tags.split(',').map((x) => x.trim()).filter(Boolean), is_blacklisted: !!memberModeration.blacklisted };
    const { error } = await supabase.from('member_moderation').upsert(payload, { onConflict: 'member_id' });
    if (error) return setStatus(error.message);
    setStatus('Moderasyon ayarları kaydedildi.');
  }

  async function saveQuickFacts() {
    if (!threads.selectedThread) return;
    const { error } = await supabase.rpc('admin_upsert_thread_quick_facts', {
      p_member_id: threads.selectedThread.member_id,
      p_virtual_profile_id: threads.selectedThread.virtual_profile_id,
      p_notes: quickFactsText,
      p_fallback_username: threads.selectedThread.member_username || null,
    });
    if (error && String(error.message || '').includes('admin_upsert_thread_quick_facts')) {
      return setStatus('DB fonksiyonu eksik: supabase/fix_thread_quick_facts_fk.sql scriptini çalıştırmalısın.');
    }
    if (error) return setStatus(error.message);
    setStatus('Quick Facts kaydedildi.');
  }

  async function fetchRegisteredMembers() {
    setLoadingMembers(true);
    const [{ data: profiles, error: profileError }, { data: members, error: memberError }] = await Promise.all([
      supabase.from('member_profiles').select('member_id, coin_balance, contact_phone, age, hobbies, city, photo_url, status_emoji, updated_at').order('updated_at', { ascending: false }),
      supabase.from('members').select('id, username, created_at'),
    ]);
    setLoadingMembers(false);
    if (profileError || memberError) return setStatus('Üye listesi alınamadı: ' + (profileError?.message || memberError?.message));

    const usernameById = Object.fromEntries((members || []).map((m) => [m.id, m.username]));
    const createdAtById = Object.fromEntries((members || []).map((m) => [m.id, m.created_at]));
    setRegisteredMembers((profiles || []).map((p) => ({ 
      id: p.member_id, 
      username: usernameById[p.member_id] || p.member_id,
      coin_balance: p.coin_balance, 
      contact_phone: p.contact_phone, 
      age: p.age,
      hobbies: p.hobbies,
      city: p.city,
      photo_url: p.photo_url,
      status_emoji: p.status_emoji,
      created_at: createdAtById[p.member_id] || p.updated_at 
    })));
  }

  async function deleteMember(memberId) {
    const { error } = await supabase.from('members').delete().eq('id', memberId);
    if (error) return setStatus(error.message);
    setRegisteredMembers((prev) => prev.filter((m) => m.id !== memberId));
    setStatus('Kullanıcı silindi.');
  }

  async function openMemberDetails(member) {
    setSelectedAdminMember({
      ...member,
      moderation_notes: '',
      tags: '',
      is_blacklisted: false,
      muted_until: null
    });
    setAdminMemberDetailOpen(true);
    setAdminMemberThreads([]);
    setAdminMemberMessageCount(0);

    const { data: mod, error: modErr } = await supabase
      .from('member_moderation')
      .select('notes, tags, is_blacklisted, muted_until')
      .eq('member_id', member.id)
      .maybeSingle();

    if (!modErr && mod) {
      setSelectedAdminMember((prev) => prev ? {
        ...prev,
        moderation_notes: mod.notes || '',
        tags: (mod.tags || []).join(', '),
        is_blacklisted: !!mod.is_blacklisted,
        muted_until: mod.muted_until || null
      } : prev);
    }

    const { count, error: countErr } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('member_id', member.id)
      .eq('sender_role', 'member');

    if (!countErr) {
      setAdminMemberMessageCount(count || 0);
    }

    const { data: threadsData, error: threadsErr } = await supabase
      .from('admin_threads')
      .select('*')
      .eq('member_id', member.id)
      .order('last_message_at', { ascending: false });

    if (!threadsErr && threadsData) {
      setAdminMemberThreads(threadsData);
    }
  }

  async function saveMemberDetails() {
    if (!selectedAdminMember) return;
    setSavingMemberDetail(true);
    setStatus('Kullanıcı bilgileri güncelleniyor...');

    const profilePayload = {
      age: selectedAdminMember.age || null,
      city: selectedAdminMember.city || '',
      hobbies: selectedAdminMember.hobbies || '',
      status_emoji: selectedAdminMember.status_emoji || '🙂',
      contact_phone: selectedAdminMember.contact_phone || '',
      coin_balance: selectedAdminMember.coin_balance ?? 100,
      updated_at: new Date().toISOString()
    };

    const { error: profileError } = await supabase
      .from('member_profiles')
      .update(profilePayload)
      .eq('member_id', selectedAdminMember.id);

    if (profileError) {
      setSavingMemberDetail(false);
      return setStatus('Profil güncellenemedi: ' + profileError.message);
    }

    const modPayload = {
      member_id: selectedAdminMember.id,
      notes: selectedAdminMember.moderation_notes || '',
      tags: selectedAdminMember.tags ? selectedAdminMember.tags.split(',').map((x) => x.trim()).filter(Boolean) : [],
      is_blacklisted: !!selectedAdminMember.is_blacklisted,
      muted_until: selectedAdminMember.muted_until || null,
      updated_at: new Date().toISOString()
    };

    const { error: modError } = await supabase
      .from('member_moderation')
      .upsert(modPayload, { onConflict: 'member_id' });

    setSavingMemberDetail(false);
    if (modError) {
      return setStatus('Moderasyon güncellenemedi: ' + modError.message);
    }

    await fetchRegisteredMembers();
    setAdminMemberDetailOpen(false);
    setStatus('Kullanıcı bilgileri başarıyla güncellendi.');
  }

  function jumpToMemberChat(thread) {
    threads.setSelectedThread(thread);
    setAdminTab('chat');
    setAdminMemberDetailOpen(false);
  }

  return {
    quickFactsText, setQuickFactsText,
    registeredMembers, setRegisteredMembers,
    loadingMembers, setLoadingMembers,
    selectedMemberProfile, setSelectedMemberProfile,
    selectedAdminMember, setSelectedAdminMember,
    adminMemberDetailOpen, setAdminMemberDetailOpen,
    adminMemberThreads, setAdminMemberThreads,
    adminMemberMessageCount, setAdminMemberMessageCount,
    savingMemberDetail, setSavingMemberDetail,
    memberModeration, setMemberModeration,
    fetchQuickFacts, fetchMemberProfile,
    fetchMemberModeration, saveMemberModeration,
    saveQuickFacts, fetchRegisteredMembers,
    deleteMember, openMemberDetails,
    saveMemberDetails, jumpToMemberChat,
  };
}
