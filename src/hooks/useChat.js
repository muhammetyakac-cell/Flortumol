import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabase';
import { COIN_COST_PER_MESSAGE } from '../appConstants';

export default function useChat({ memberSession, isAdmin, selectedProfileId, userView, coins, setStatus, setCoinPurchaseModalOpen, setOnboardingActionCount }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [focusedMessageId, setFocusedMessageId] = useState(null);
  const [unreadByProfile, setUnreadByProfile] = useState({});

  const chatBoxRef = useRef(null);
  const latestMemberMessageRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    if (!memberSession || !selectedProfileId || isAdmin || userView !== 'chat') return;
    fetchMessages(selectedProfileId);
  }, [memberSession, selectedProfileId, isAdmin, userView]);

  useEffect(() => {
    if (!selectedProfileId || isAdmin || userView !== 'chat') return;
    setUnreadByProfile((prev) => ({ ...prev, [selectedProfileId]: 0 }));
  }, [selectedProfileId, isAdmin, userView]);

  useEffect(() => {
    if (!memberSession || isAdmin) return;
    const focusTarget = latestMemberMessageRef.current;
    if (focusTarget && focusedMessageId) {
      window.requestAnimationFrame(() => {
        focusTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }
    if (!chatBoxRef.current) return;
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages, memberSession, isAdmin, focusedMessageId]);

  async function fetchUnreadCounts() {
    if (!memberSession || isAdmin) return;
    const { data, error } = await supabase.from('messages').select('virtual_profile_id').eq('member_id', memberSession.id).eq('sender_role', 'virtual').eq('seen_by_member', false);
    if (error) return setStatus(error.message);
    const counts = (data || []).reduce((acc, row) => {
      acc[row.virtual_profile_id] = (acc[row.virtual_profile_id] || 0) + 1;
      return acc;
    }, {});
    setUnreadByProfile(counts);
  }

  async function fetchMessages(profileId) {
    const { data, error } = await supabase.from('messages').select('*').eq('virtual_profile_id', profileId).eq('member_id', memberSession.id).order('created_at', { ascending: true });
    if (error) return setStatus(error.message);
    setMessages(data || []);

    await supabase.from('messages').update({ seen_by_member: true, seen_by_member_at: new Date().toISOString() }).eq('virtual_profile_id', profileId).eq('member_id', memberSession.id).eq('sender_role', 'virtual').eq('seen_by_member', false);
    setUnreadByProfile((prev) => ({ ...prev, [profileId]: 0 }));
  }

  async function sendMessage() {
    if (!memberSession || !selectedProfileId || !newMessage.trim()) return;
    const rawMessage = newMessage.trim();
    const hasCoin = await coins.consumeCoins(COIN_COST_PER_MESSAGE);
    if (!hasCoin) { setCoinPurchaseModalOpen(true); return setStatus('Yetersiz jeton.'); }

    const slashCommands = { '/selam': 'Selam 👋', '/kahve': 'Kahve içelim mi? ☕' };
    const normalizedMessage = slashCommands[rawMessage.toLowerCase()] || rawMessage;
    const activeProfileId = selectedProfileId;
    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticMessage = {
      id: optimisticId,
      member_id: memberSession.id,
      virtual_profile_id: activeProfileId,
      sender_role: 'member',
      content: normalizedMessage,
      seen_by_member: true,
      seen_by_admin: false,
      created_at: new Date().toISOString(),
    };

    setNewMessage('');
    setMessages((prev) => [...prev, optimisticMessage]);
    setFocusedMessageId(optimisticId);
    messageInputRef.current?.focus();

    const { data, error } = await supabase.from('messages').insert({
      member_id: memberSession.id, virtual_profile_id: activeProfileId, sender_role: 'member', content: normalizedMessage, seen_by_member: true, seen_by_admin: false,
    }).select('*').single();
    if (error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId));
      setFocusedMessageId(null);
      setNewMessage(rawMessage);
      return setStatus(error.message);
    }
    recordEngagement('member_message', memberSession.id, activeProfileId, { source: 'chat_input' });
    setOnboardingActionCount((prev) => prev + 1);
    if (data) {
      setMessages((prev) => prev.map((msg) => (msg.id === optimisticId ? data : msg)));
      setFocusedMessageId(data.id);
    }
    fetchMessages(activeProfileId);
  }

  async function sendReaction(profileId, reactionType) {
    if (!memberSession || !profileId) return;
    const hasCoin = await coins.consumeCoins(COIN_COST_PER_MESSAGE);
    if (!hasCoin) { setCoinPurchaseModalOpen(true); return setStatus('Yetersiz jeton.'); }
    const templates = { heart: '💘 Kalp gönderdim.', wave: '👋 Selam, sana el salladım.', like: '👍 Profilini beğendim.' };
    const content = templates[reactionType];
    if (!content) return;

    const { error } = await supabase.from('messages').insert({
      member_id: memberSession.id, virtual_profile_id: profileId, sender_role: 'member', content, seen_by_member: true, seen_by_admin: false,
    });
    if (error) return setStatus(error.message);
    recordEngagement('member_message', memberSession.id, profileId, { source: `reaction_${reactionType}` });
    setOnboardingActionCount((prev) => prev + 1);
    setStatus('Etkileşim mesajı gönderildi.');
  }

  async function recordEngagement(eventType, memberId, virtualProfileId, meta = {}) {
    try { await supabase.from('engagement_events').insert({ event_type: eventType, member_id: memberId, virtual_profile_id: virtualProfileId, meta }); } catch {}
  }

  return {
    messages, setMessages,
    newMessage, setNewMessage,
    focusedMessageId, setFocusedMessageId,
    unreadByProfile, setUnreadByProfile,
    chatBoxRef, latestMemberMessageRef, messageInputRef,
    fetchUnreadCounts, fetchMessages,
    sendMessage, sendReaction, recordEngagement,
  };
}
