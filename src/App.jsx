import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

// Pages (lazy loaded for code splitting)
import LandingPage from './pages/LandingPage';
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const CityPage = lazy(() => import('./pages/CityPage'));
const BlogListPage = lazy(() => import('./pages/blog/BlogListPage'));
const BlogPostPage = lazy(() => import('./pages/blog/BlogPostPage'));
const CategoryBlogPage = lazy(() => import('./pages/blog/CategoryBlogPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));
import { supabase } from './supabase';
import AdminPanel from './pages/app/AdminPanel';
import DiscoverPage from './pages/app/DiscoverPage';
import ChatPage from './pages/app/ChatPage';
import ProfileCoinsPage from './pages/app/ProfileCoinsPage';
import AppHeader from './components/AppHeader';
import StatusBanner from './components/StatusBanner';
import OnboardingBanner from './components/OnboardingBanner';
import LowCoinBanner from './components/LowCoinBanner';
import AuthModal from './components/AuthModal';
import CoinPurchaseModal from './components/CoinPurchaseModal';
import MobileNav from './components/MobileNav';
import PublicFooter from './components/PublicFooter';
import { useAuth } from './hooks/useAuth';
import useCoins from './hooks/useCoins';
import useVirtualProfiles from './hooks/useVirtualProfiles';
import useChat from './hooks/useChat';
import useRealtime from './hooks/useRealtime';
import useAdminThreads from './hooks/useAdminThreads';
import useAdminStats from './hooks/useAdminStats';
import useAdminMembers from './hooks/useAdminMembers';
import useAdminUI from './hooks/useAdminUI';
import { hashToInt } from './helpers';
import {
  initialMemberProfile, LIST_BATCH_SIZE, buildHourlyOnlineMap
} from './appConstants';

function PageSuspense({ children }) {
  return <Suspense fallback={<div className="flex-1 flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>}>{children}</Suspense>;
}

export default function App() {
  const [status, setStatus] = useState('');
  const { user: memberSession, loading: authLoading, signIn: supabaseSignIn, signUp: supabaseSignUp, signOut: supabaseSignOut } = useAuth();
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') return 'user';
    return window.localStorage.getItem('flort_login_mode') || 'user';
  });
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('flort_admin_session') === 'true';
  });
  const loading = authLoading; 
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [memberProfile, setMemberProfile] = useState(initialMemberProfile);
  const [onboardingActionCount, setOnboardingActionCount] = useState(0);
  const [onlineProfiles, setOnlineProfiles] = useState({});
  const [forcedOnlineProfiles, setForcedOnlineProfiles] = useState({});
  const [typingLabel, setTypingLabel] = useState('');
  const [adminTypingByThread, setAdminTypingByThread] = useState({});
  const [cityFilter, setCityFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [profileSearch, setProfileSearch] = useState('');
  const [discoverSort, setDiscoverSort] = useState('match');
  const [likedProfiles, setLikedProfiles] = useState({});
  const [heartedProfiles, setHeartedProfiles] = useState({});
  const [wavedProfiles, setWavedProfiles] = useState({});
  const [userView, setUserView] = useState('discover');
  const [mobileViewMode, setMobileViewMode] = useState('list');
  const [userProfileRenderCount, setUserProfileRenderCount] = useState(LIST_BATCH_SIZE);
  const [adminThreadRenderCount, setAdminThreadRenderCount] = useState(LIST_BATCH_SIZE);
  const [adminUnreadByThread, setAdminUnreadByThread] = useState({});
  const [hourKey, setHourKey] = useState(() => new Date().toISOString().slice(0, 13));

  const loggedIn = !!memberSession || isAdmin;

  const adminUI = useAdminUI();
  const { adminDrawerOpen, adminTab, setAdminTab, adminDarkMode, setAdminDarkMode, notificationSoundEnabled, setNotificationSoundEnabled } = adminUI;

  const coins = useCoins({ memberSession, isAdmin, loggedIn, memberProfile, setMemberProfile, setStatus, userView, adminTab });
  const chat = useChat({ memberSession, isAdmin, selectedProfileId, userView, coins, setStatus, setCoinPurchaseModalOpen: coins.setCoinPurchaseModalOpen, setOnboardingActionCount });
  const threads = useAdminThreads({ isAdmin, adminUnreadByThread, setStatus, selectRows, insertRows, updateRows, recordEngagement: chat.recordEngagement });
  const profiles = useVirtualProfiles({ setStatus, selectRows, fetchIncomingThreads: threads.fetchIncomingThreads, selectedProfileId, setSelectedProfileId });
  const profileById = useMemo(() => Object.fromEntries(profiles.virtualProfiles.map((p) => [p.id, p])), [profiles.virtualProfiles]);
  const stats = useAdminStats({ isAdmin, adminTab, incomingThreads: threads.incomingThreads, threadMessages: threads.threadMessages, virtualProfiles: profiles.virtualProfiles, profileById, setStatus });
  const members = useAdminMembers({ threads, setStatus, setAdminTab });

  useRealtime({
    loggedIn, isAdmin, memberSession, selectedProfileId, selectedThread: threads.selectedThread, userView,
    virtualProfiles: profiles.virtualProfiles, notificationSoundEnabled,
    newMessage: chat.newMessage, adminReply: threads.adminReply,
    fetchIncomingThreads: threads.fetchIncomingThreads, fetchThreadMessages: threads.fetchThreadMessages,
    fetchMessages: chat.fetchMessages, setUnreadByProfile: chat.setUnreadByProfile,
    setAdminUnreadByThread, setForcedOnlineProfiles,
    setOnlineProfiles, setTypingLabel, setAdminTypingByThread,
  });

  const adminChatBoxRef = useRef(null);
  const profileListRef = useRef(null);
  const threadQueueRef = useRef(null);

  const selectedProfile = useMemo(() => profiles.virtualProfiles.find((p) => p.id === selectedProfileId) || null, [selectedProfileId, profiles.virtualProfiles]);
  const sortedProfiles = useMemo(() => {
    return [...profiles.virtualProfiles].sort((a, b) => {
      const unreadA = chat.unreadByProfile[a.id] || 0;
      const unreadB = chat.unreadByProfile[b.id] || 0;
      if (unreadA !== unreadB) return unreadB - unreadA;
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
  }, [profiles.virtualProfiles, chat.unreadByProfile]);

  const selectedThreadProfile = useMemo(() => (threads.selectedThread ? profileById[threads.selectedThread.virtual_profile_id] : null), [threads.selectedThread, profileById]);
  
  const sortedIncomingThreads = useMemo(() => {
    const now = Date.now();
    const filtered = [...threads.incomingThreads].filter((thread) => {
      const key = threadKey(thread.member_id, thread.virtual_profile_id);
      const ops = threads.threadOpsByKey[key] || {};
      const waitMin = thread.last_message_at ? (now - new Date(thread.last_message_at).getTime()) / 60000 : 0;
      const unread = adminUnreadByThread[key] || 0;
      if (threads.threadFilter.waitingOnly && thread.last_sender_role !== 'member' && unread <= 0) return false;
      if (threads.threadFilter.slaRisk && waitMin < 15) return false;
      if (threads.threadFilter.unassigned && ops.assigned_admin) return false;
      if (threads.threadFilter.blacklist && !ops.blacklisted) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      const keyA = threadKey(a.member_id, a.virtual_profile_id);
      const keyB = threadKey(b.member_id, b.virtual_profile_id);
      const unreadA = adminUnreadByThread[keyA] || 0;
      const unreadB = adminUnreadByThread[keyB] || 0;
      const waitMinA = a.last_message_at ? (now - new Date(a.last_message_at).getTime()) / 60000 : 0;
      const waitMinB = b.last_message_at ? (now - new Date(b.last_message_at).getTime()) / 60000 : 0;

      if (threads.threadSortMode === 'unread') {
        if (unreadA !== unreadB) return unreadB - unreadA;
      } else if (threads.threadSortMode === 'sla') {
        if (waitMinA !== waitMinB) return waitMinB - waitMinA;
      } else if (threads.threadSortMode === 'recent') {
        return new Date(b.last_message_at || 0) - new Date(a.last_message_at || 0);
      } else {
        if (waitMinA !== waitMinB) return waitMinB - waitMinA;
        if (unreadA !== unreadB) return unreadB - unreadA;
      }
      return new Date(b.last_message_at || 0) - new Date(a.last_message_at || 0);
    });
  }, [threads.incomingThreads, threads.threadOpsByKey, adminUnreadByThread, threads.threadFilter, threads.threadSortMode]);

  const slaStats = useMemo(() => {
    const waiting = threads.incomingThreads.filter((t) => t.last_sender_role === 'member' || (adminUnreadByThread[threadKey(t.member_id, t.virtual_profile_id)] || 0) > 0);
    const now = Date.now();
    const avgWaitMin = waiting.length
      ? waiting.reduce((acc, t) => {
        const ts = t.last_message_at || t.created_at;
        const diff = ts ? (now - new Date(ts).getTime()) / 60000 : 0;
        return acc + Math.max(diff, 0);
      }, 0) / waiting.length
      : 0;
    return { waitingCount: waiting.length, avgWaitMin, lastReplyMin: threads.selectedThread?.last_message_at ? (now - new Date(threads.selectedThread.last_message_at).getTime()) / 60000 : 0 };
  }, [threads.incomingThreads, threads.selectedThread, adminUnreadByThread]);

  const interestScore = useMemo(() => {
    if (!selectedProfileId) return 0;
    const weekKey = (() => {
      const now = new Date();
      const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      const dayOfYear = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start.getTime()) / 86400000) + 1;
      return `${now.getUTCFullYear()}-W${Math.ceil(dayOfYear / 7)}`;
    })();
    const seed = `${weekKey}-${memberSession?.id || 'guest'}-${selectedProfileId}`;
    const score = 70 + (hashToInt(seed) % 31);
    return Math.min(100, Math.max(70, score));
  }, [selectedProfileId, memberSession?.id]);

  useEffect(() => {
    if (!loggedIn || isAdmin) return;
    const tick = () => {
      const nowHour = new Date().toISOString().slice(0, 13);
      setHourKey((prev) => (prev === nowHour ? prev : nowHour));
    };
    const interval = window.setInterval(tick, 60 * 1000);
    return () => window.clearInterval(interval);
  }, [loggedIn, isAdmin]);

  useEffect(() => {
    if (!loggedIn) return;
    profiles.fetchVirtualProfiles();
    if (!isAdmin) chat.fetchUnreadCounts();
    if (isAdmin) threads.fetchIncomingThreads();
  }, [loggedIn, isAdmin, memberSession]);

  const effectiveOnlineProfiles = useMemo(() => {
    if (isAdmin) return onlineProfiles;
    return { ...buildHourlyOnlineMap(profiles.virtualProfiles, hourKey), ...forcedOnlineProfiles };
  }, [isAdmin, onlineProfiles, profiles.virtualProfiles, hourKey, forcedOnlineProfiles]);

  const discoverProfiles = useMemo(() => {
    const filtered = sortedProfiles.filter((profile) => {
      const cityOk = cityFilter ? (profile.city || '').toLowerCase().includes(cityFilter.toLowerCase()) : true;
      const genderOk = genderFilter === 'all' ? true : (profile.gender || '').toLowerCase() === genderFilter.toLowerCase();
      const text = `${profile.name || ''} ${profile.city || ''} ${profile.hobbies || ''}`.toLowerCase();
      const searchOk = profileSearch ? text.includes(profileSearch.toLowerCase()) : true;
      return cityOk && genderOk && searchOk;
    });
    const score = (profile) => {
      const a = new Set((profile.hobbies || '').toLowerCase().split(',').map((x) => x.trim()).filter(Boolean));
      const b = new Set((memberProfile.hobbies || '').toLowerCase().split(',').map((x) => x.trim()).filter(Boolean));
      if (!a.size || !b.size) return 0;
      let common = 0;
      a.forEach((item) => { if (b.has(item)) common += 1; });
      return Math.round((common / Math.max(a.size, b.size)) * 100);
    };

    return filtered.sort((p1, p2) => {
      if (discoverSort === 'newest') return new Date(p2.created_at || 0) - new Date(p1.created_at || 0);
      if (discoverSort === 'age_asc') return Number(p1.age || 0) - Number(p2.age || 0);
      if (discoverSort === 'online') return Number(!!effectiveOnlineProfiles[p2.id]) - Number(!!effectiveOnlineProfiles[p1.id]);
      return score(p2) - score(p1);
    });
  }, [sortedProfiles, cityFilter, genderFilter, profileSearch, memberProfile.hobbies, discoverSort, effectiveOnlineProfiles]);

  const totalUnreadCount = useMemo(
    () => Object.values(chat.unreadByProfile).reduce((sum, count) => sum + Number(count || 0), 0),
    [chat.unreadByProfile]
  );

  const activeProfileCount = useMemo(
    () => profiles.virtualProfiles.filter((profile) => effectiveOnlineProfiles[profile.id]).length,
    [profiles.virtualProfiles, effectiveOnlineProfiles]
  );

  const spotlightProfiles = useMemo(() => discoverProfiles.slice(0, 5), [discoverProfiles]);
  const renderedUserProfiles = useMemo(
    () => sortedProfiles.slice(0, userProfileRenderCount),
    [sortedProfiles, userProfileRenderCount]
  );
  const renderedIncomingThreads = useMemo(
    () => sortedIncomingThreads.slice(0, adminThreadRenderCount),
    [sortedIncomingThreads, adminThreadRenderCount]
  );

  const onboardingState = useMemo(() => {
    const hasPhoto = !!memberProfile.photo_url;
    const hasHobbies = (memberProfile.hobbies || '').split(',').map((x) => x.trim()).filter(Boolean).length > 0;
    const hasThreeActions = onboardingActionCount >= 3;
    const completed = hasPhoto && hasHobbies && hasThreeActions;
    const currentStep = !hasPhoto ? 1 : !hasHobbies ? 2 : !hasThreeActions ? 3 : 0;
    return { hasPhoto, hasHobbies, hasThreeActions, completed, currentStep };
  }, [memberProfile.photo_url, memberProfile.hobbies, onboardingActionCount]);

  function threadKey(memberId, profileId) { return `${memberId}::${profileId}`; }

  function buildStatsSnapshot(messages = [], members = []) {
    const memberMessages = messages.filter((m) => m.sender_role === 'member');
    const adminReplies = messages.filter((m) => m.sender_role === 'virtual');
    const activeThreadKeys = new Set(messages.map((m) => `${m.member_id}::${m.virtual_profile_id}`));
    const respondedThreadKeys = new Set();
    const responseMinutes = [];

    const grouped = new Map();
    messages.forEach((m) => {
      const key = `${m.member_id}::${m.virtual_profile_id}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(m);
    });

    grouped.forEach((rows, key) => {
      rows.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      let lastMemberTs = null;
      rows.forEach((row) => {
        if (row.sender_role === 'member') lastMemberTs = row.created_at;
        else if (row.sender_role === 'virtual' && lastMemberTs) {
          respondedThreadKeys.add(key);
          const diffMin = (new Date(row.created_at).getTime() - new Date(lastMemberTs).getTime()) / 60000;
          if (diffMin >= 0) responseMinutes.push(diffMin);
          lastMemberTs = null;
        }
      });
    });

    return {
      totalMessagesToday: messages.length,
      memberMessagesToday: memberMessages.length,
      adminRepliesToday: adminReplies.length,
      respondedThreadsToday: respondedThreadKeys.size,
      newMembersToday: members.length,
      activeThreadsToday: activeThreadKeys.size,
      avgResponseMinToday: responseMinutes.length ? responseMinutes.reduce((a, b) => a + b, 0) / responseMinutes.length : 0,
    };
  }

  async function handleSignIn() {
    if (mode === 'admin') {
      try {
        const res = await fetch('/api/admin-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: authForm.password }),
        });
        const data = await res.json();
        if (!data.ok || !data.session) {
          setStatus(data.error === 'invalid_password' ? 'Admin şifresi hatalı.' : (data.error || 'Giriş başarısız.'));
          return;
        }
        const { error: sessionError } = await supabase.auth.setSession(data.session);
        if (sessionError) {
          setStatus('Oturum kurulamadı: ' + sessionError.message);
          return;
        }
        setIsAdmin(true);
        if (typeof window !== 'undefined') window.localStorage.setItem('flort_admin_session', 'true');
        setStatus('Admin girişi başarılı.');
      } catch (err) {
        setStatus('Admin giriş hatası: ' + err.message);
      }
      return;
    }
    if (!authForm.username || !authForm.password) return setStatus('Kullanıcı adı ve şifre gerekli.');
    if (authForm.password.length < 6) return setStatus('Şifre en az 6 karakter olmalı.');
    const result = await supabaseSignIn(authForm.username, authForm.password);
    if (!result?.ok) setStatus(result?.error || 'Giriş başarısız.');
    else setStatus('Giriş yapıldı.');
  }

  async function handleSignUp() {
    if (mode === 'admin') return setStatus('Admin kayıt olamaz.');
    if (!authForm.username || !authForm.password) return setStatus('Kullanıcı adı ve şifre gerekli.');
    if (authForm.password.length < 6) return setStatus('Şifre en az 6 karakter olmalı.');
    const result = await supabaseSignUp(authForm.username, authForm.password);
    if (!result?.ok) setStatus(result?.error || 'Kayıt başarısız.');
    else setStatus('Kayıt başarılı!');
  }

  async function selectRows(table, buildQuery) {
    const query = buildQuery(supabase.from(table).select('*'));
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async function insertRows(table, payload) {
    const { data, error } = await supabase.from(table).insert(payload).select();
    if (error) throw error;
    return data || [];
  }

  async function updateRows(table, payload, buildQuery) {
    const query = buildQuery(supabase.from(table).update(payload));
    const { data, error } = await query.select();
    if (error) throw error;
    return data || [];
  }

  function formatTime(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  }

  async function handleSignOut() {
    setIsAdmin(false);
    await supabaseSignOut();
    if (typeof window !== 'undefined') window.localStorage.removeItem('flort_admin_session');
    setStatus('Çıkış yapıldı.');
    
    setSelectedProfileId(null);
    chat.setMessages([]);
    setIncomingThreads([]);
    threads.setSelectedThread(null);
    chat.setUnreadByProfile({});
    setAdminUnreadByThread({});
    setTypingLabel('');
    setUserView('discover');
  }

  function openChatWithProfile(profileId) {
    setSelectedProfileId(profileId);
    setUserView('chat');
    setMobileViewMode('chat');
  }

  async function uploadImage(file, folder) {
    if (!file) return null;
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('profile-images').upload(path, file, { upsert: true });
    if (uploadError) { setStatus(`Görsel yükleme hatası: ${uploadError.message}`); return null; }
    const { data } = supabase.storage.from('profile-images').getPublicUrl(path);
    return data?.publicUrl || null;
  }

  async function saveOwnProfile() {
    if (!memberSession) return;
    const payload = { member_id: memberSession.id, age: memberProfile.age ? Number(memberProfile.age) : null, hobbies: memberProfile.hobbies, city: memberProfile.city, photo_url: memberProfile.photo_url, status_emoji: memberProfile.status_emoji, coin_balance: Number(memberProfile.coin_balance ?? 100), contact_phone: memberProfile.contact_phone || null };
    const { error } = await supabase.from('member_profiles').upsert(payload, { onConflict: 'member_id' });
    if (error) return setStatus(error.message);
    setStatus('Profil bilgilerin kaydedildi.');
  }

  function handleUserProfileListScroll(e) {
    const target = e.currentTarget;
    if (target.scrollTop + target.clientHeight < target.scrollHeight - 40) return;
    setUserProfileRenderCount((prev) => Math.min(prev + LIST_BATCH_SIZE, sortedProfiles.length));
  }

  function handleAdminThreadQueueScroll(e) {
    const target = e.currentTarget;
    if (target.scrollTop + target.clientHeight < target.scrollHeight - 40) return;
    setAdminThreadRenderCount((prev) => Math.min(prev + LIST_BATCH_SIZE, sortedIncomingThreads.length));
  }

  // --- MODERNIZED UI RENDERING ---
  return (
    <div className="min-h-screen bg-slate-800 text-white flex flex-col font-sans selection:bg-brand-500/30">
      
      <AppHeader
        loggedIn={loggedIn}
        isAdmin={isAdmin}
        memberSession={memberSession}
        userView={userView} setUserView={setUserView}
        adminTab={adminTab} setAdminTab={setAdminTab}
        memberProfile={memberProfile}
        totalUnreadCount={totalUnreadCount}
        handleSignOut={handleSignOut}
        mode={mode} setMode={setMode}
        setShowAuthModal={setShowAuthModal}
      />

      <OnboardingBanner onboardingState={onboardingState} setUserView={setUserView} />
      <LowCoinBanner memberProfile={memberProfile} setUserView={setUserView} />
      <StatusBanner status={status} onClose={() => setStatus('')} />

      {/* 🚀 MAIN CONTENT AREA */}
      <main className={`flex-1 flex flex-col max-w-[1440px] w-full mx-auto p-4 md:p-6 ${loggedIn && !isAdmin ? 'pb-20 md:pb-6' : ''}`}>
        
        {/* ======================= LANDING PAGE + AUTH MODAL ======================= */}
        {!loggedIn ? (
          <>
            {/* ---- PUBLIC PAGES (SEO İÇERİĞİ VE YÖNLENDİRME) ---- */}
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
              <Routes>
                <Route path="/" element={<LandingPage setMode={setMode} setShowAuthModal={setShowAuthModal} />} />
                <Route path="/hakkimizda" element={<PageSuspense><AboutPage setMode={setMode} setShowAuthModal={setShowAuthModal} /></PageSuspense>} />
                <Route path="/gizlilik-politikasi" element={<PageSuspense><PrivacyPage /></PageSuspense>} />
                <Route path="/kullanim-kosullari" element={<PageSuspense><TermsPage /></PageSuspense>} />
                <Route path="/blog" element={<PageSuspense><BlogListPage /></PageSuspense>} />
                <Route path="/blog/kategori/:category" element={<PageSuspense><CategoryBlogPage /></PageSuspense>} />
                <Route path="/blog/:slug" element={<PageSuspense><BlogPostPage /></PageSuspense>} />
                <Route path="/iletisim" element={<PageSuspense><ContactPage /></PageSuspense>} />
                <Route path="/cerez-politikasi" element={<PageSuspense><CookiePolicyPage /></PageSuspense>} />
                <Route path="/:city" element={<PageSuspense><CityPage setMode={setMode} setShowAuthModal={setShowAuthModal} /></PageSuspense>} />
                <Route path="*" element={<LandingPage setMode={setMode} setShowAuthModal={setShowAuthModal} />} />
              </Routes>

              <PublicFooter />
            </div>

            <AuthModal
              showAuthModal={showAuthModal}
              setShowAuthModal={setShowAuthModal}
              mode={mode}
              authForm={authForm}
              setAuthForm={setAuthForm}
              handleSignIn={handleSignIn}
              handleSignUp={handleSignUp}
              loading={loading}
              setMode={setMode}
            />
          </>
        )

        : isAdmin ? (
          <AdminPanel
            adminTab={adminTab} setAdminTab={setAdminTab}
            selectedThread={threads.selectedThread} setSelectedThread={threads.setSelectedThread}
            threadFilter={threads.threadFilter} setThreadFilter={threads.setThreadFilter}
            threadSortMode={threads.threadSortMode} setThreadSortMode={threads.setThreadSortMode}
            adminDarkMode={adminDarkMode} setAdminDarkMode={setAdminDarkMode}
            adminReply={threads.adminReply} setAdminReply={threads.setAdminReply}
            quickFactsText={members.quickFactsText} setQuickFactsText={members.setQuickFactsText}
            selectedThreadKeys={threads.selectedThreadKeys} setSelectedThreadKeys={threads.setSelectedThreadKeys}
            bulkTemplate={threads.bulkTemplate} setBulkTemplate={threads.setBulkTemplate}
            bulkPriority={threads.bulkPriority} setBulkPriority={threads.setBulkPriority}
            bulkAssignTo={threads.bulkAssignTo} setBulkAssignTo={threads.setBulkAssignTo}
            bulkFollowUpDate={threads.bulkFollowUpDate} setBulkFollowUpDate={threads.setBulkFollowUpDate}
            bulkBlacklistMode={threads.bulkBlacklistMode} setBulkBlacklistMode={threads.setBulkBlacklistMode}
            bulkStatusTag={threads.bulkStatusTag} setBulkStatusTag={threads.setBulkStatusTag}
            adminDrawerOpen={adminDrawerOpen}
            adminStats={stats.adminStats} previousAdminStats={stats.previousAdminStats}
            statsRange={stats.statsRange} setStatsRange={stats.setStatsRange}
            statsDateRange={stats.statsDateRange} setStatsDateRange={stats.setStatsDateRange}
            statsAlerts={stats.statsAlerts}
            engagementInsights={stats.engagementInsights}
            slaStats={slaStats}
            adminUnreadByThread={adminUnreadByThread} setAdminUnreadByThread={setAdminUnreadByThread}
            adminMemberDetailOpen={members.adminMemberDetailOpen} setAdminMemberDetailOpen={members.setAdminMemberDetailOpen}
            selectedAdminMember={members.selectedAdminMember} setSelectedAdminMember={members.setSelectedAdminMember}
            adminMemberThreads={members.adminMemberThreads} setAdminMemberThreads={members.setAdminMemberThreads}
            adminMemberMessageCount={members.adminMemberMessageCount} setAdminMemberMessageCount={members.setAdminMemberMessageCount}
            savingMemberDetail={members.savingMemberDetail} setSavingMemberDetail={members.setSavingMemberDetail}
            registeredMembers={members.registeredMembers} loadingMembers={members.loadingMembers}
            paymentSettings={coins.paymentSettings} setPaymentSettings={coins.setPaymentSettings}
            notificationSoundEnabled={notificationSoundEnabled} setNotificationSoundEnabled={setNotificationSoundEnabled}
profileForm={profiles.profileForm} setProfileForm={profiles.setProfileForm}
            commandPaletteOpen={threads.commandPaletteOpen} setCommandPaletteOpen={threads.setCommandPaletteOpen}
            threadTimeline={threads.threadTimeline}
            renderedIncomingThreads={renderedIncomingThreads}
            sortedIncomingThreads={sortedIncomingThreads}
            threadOpsByKey={threads.threadOpsByKey}
            threadMessages={threads.threadMessages}
            selectedThreadProfile={selectedThreadProfile}
            selectedMemberProfile={members.selectedMemberProfile}
            aiSuggestions={threads.aiSuggestions} setAiSuggestions={threads.setAiSuggestions}
            loadingSuggestions={threads.loadingSuggestions}
            adminChatBoxRef={adminChatBoxRef}
            threadQueueRef={threadQueueRef}
            sendAdminReply={threads.sendAdminReply}
            fetchAiSuggestions={threads.fetchAiSuggestions}
            saveQuickFacts={members.saveQuickFacts}
            updateSelectedThreadTag={threads.updateSelectedThreadTag}
            sendBulkTemplate={threads.sendBulkTemplate}
            applyBulkThreadOps={threads.applyBulkThreadOps}
            exportStatsCsv={stats.exportStatsCsv}
            fetchThreadOperations={threads.fetchThreadOperations}
            fetchRegisteredMembers={members.fetchRegisteredMembers}
            savePaymentSettings={coins.savePaymentSettings}
            uploadImage={uploadImage}
            createVirtualProfile={profiles.createVirtualProfile}
            fillRandomVirtualProfile={profiles.fillRandomVirtualProfile}
            openMemberDetails={members.openMemberDetails}
            saveMemberDetails={members.saveMemberDetails}
            deleteMember={members.deleteMember}
            jumpToMemberChat={members.jumpToMemberChat}
            handleAdminThreadQueueScroll={handleAdminThreadQueueScroll}
            setStatus={setStatus}
          />
        )

        : userView === 'discover' ? (
          <DiscoverPage
            discoverProfiles={discoverProfiles}
            sortedProfiles={sortedProfiles}
            cityFilter={cityFilter} setCityFilter={setCityFilter}
            genderFilter={genderFilter} setGenderFilter={setGenderFilter}
            profileSearch={profileSearch} setProfileSearch={setProfileSearch}
            discoverSort={discoverSort} setDiscoverSort={setDiscoverSort}
            effectiveOnlineProfiles={effectiveOnlineProfiles}
            memberProfile={memberProfile}
            interestScore={interestScore}
            totalUnreadCount={totalUnreadCount}
            activeProfileCount={activeProfileCount}
            spotlightProfiles={spotlightProfiles}
            userProfileRenderCount={userProfileRenderCount}
            setUserProfileRenderCount={setUserProfileRenderCount}
            userView={userView} setUserView={setUserView}
            heartedProfiles={heartedProfiles} setHeartedProfiles={setHeartedProfiles}
            wavedProfiles={wavedProfiles} setWavedProfiles={setWavedProfiles}
            selectedProfileId={selectedProfileId} setSelectedProfileId={setSelectedProfileId}
            setMobileViewMode={setMobileViewMode}
            sendReaction={chat.sendReaction}
            openChatWithProfile={openChatWithProfile}
            handleUserProfileListScroll={handleUserProfileListScroll}
            profileListRef={profileListRef}
          />
        )

        : userView === 'chat' ? (
          <ChatPage
            renderedUserProfiles={renderedUserProfiles}
            selectedProfileId={selectedProfileId} setSelectedProfileId={setSelectedProfileId}
            mobileViewMode={mobileViewMode} setMobileViewMode={setMobileViewMode}
            effectiveOnlineProfiles={effectiveOnlineProfiles}
            messages={chat.messages}
            selectedProfile={selectedProfile}
            newMessage={chat.newMessage} setNewMessage={chat.setNewMessage}
            sendMessage={chat.sendMessage}
            typingLabel={typingLabel}
            coinSpendFeedback={coins.coinSpendFeedback}
            unreadByProfile={chat.unreadByProfile}
            chatBoxRef={chat.chatBoxRef}
            latestMemberMessageRef={chat.latestMemberMessageRef}
            messageInputRef={chat.messageInputRef}
            focusedMessageId={chat.focusedMessageId}
            handleUserProfileListScroll={handleUserProfileListScroll}
            profileListRef={profileListRef}
          />
        )

        /* ======================= USER SCREEN: PROFILE & COINS ======================= */
        : (
          <ProfileCoinsPage
            userView={userView}
            memberProfile={memberProfile} setMemberProfile={setMemberProfile}
            saveOwnProfile={saveOwnProfile}
            uploadImage={uploadImage}
            requestCoinCheckout={coins.requestCoinCheckout}
            coinCheckoutLoading={coins.coinCheckoutLoading}
            coinSuccessGuideOpen={coins.coinSuccessGuideOpen} setCoinSuccessGuideOpen={coins.setCoinSuccessGuideOpen}
            handleCoinPurchaseTest={coins.handleCoinPurchaseTest}
          />
        )
      }
      </main>

      <CoinPurchaseModal
        coinPurchaseModalOpen={coins.coinPurchaseModalOpen}
        isAdmin={isAdmin}
        setCoinPurchaseModalOpen={coins.setCoinPurchaseModalOpen}
        setZeroCoinPromptDismissed={coins.setZeroCoinPromptDismissed}
        setUserView={setUserView}
      />

      <MobileNav
        loggedIn={loggedIn}
        isAdmin={isAdmin}
        adminTab={adminTab} setAdminTab={setAdminTab}
        userView={userView} setUserView={setUserView}
        setMobileViewMode={setMobileViewMode}
        totalUnreadCount={totalUnreadCount}
        memberProfile={memberProfile}
      />

      <Analytics />
    </div>
  );
}
