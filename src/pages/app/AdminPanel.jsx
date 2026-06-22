import { useMemo } from 'react';
import { formatTime, COIN_COST_PER_MESSAGE, threadKey, DEFAULT_CHECKOUT_ENDPOINT, THREAD_TAGS, BULK_TEMPLATES, pctChange, autoResizeTextarea } from '../../appConstants';
import { supabase } from '../../supabase';

export default function AdminPanel({
  adminTab, setAdminTab,
  selectedThread, setSelectedThread,
  threadFilter, setThreadFilter,
  threadSortMode, setThreadSortMode,
  adminDarkMode, setAdminDarkMode,
  adminReply, setAdminReply,
  quickFactsText, setQuickFactsText,
  selectedThreadKeys, setSelectedThreadKeys,
  bulkTemplate, setBulkTemplate,
  bulkPriority, setBulkPriority,
  bulkAssignTo, setBulkAssignTo,
  bulkFollowUpDate, setBulkFollowUpDate,
  bulkBlacklistMode, setBulkBlacklistMode,
  bulkStatusTag, setBulkStatusTag,
  adminDrawerOpen,
  adminStats, previousAdminStats,
  statsRange, setStatsRange,
  statsDateRange, setStatsDateRange,
  statsAlerts,
  engagementInsights,
  slaStats,
  adminUnreadByThread, setAdminUnreadByThread,
  adminMemberDetailOpen, setAdminMemberDetailOpen,
  selectedAdminMember, setSelectedAdminMember,
  adminMemberThreads, setAdminMemberThreads,
  adminMemberMessageCount, setAdminMemberMessageCount,
  savingMemberDetail, setSavingMemberDetail,
  paymentSettings, setPaymentSettings,
  notificationSoundEnabled, setNotificationSoundEnabled,
  profileForm, setProfileForm,
  registeredMembers, loadingMembers,
  commandPaletteOpen, setCommandPaletteOpen,
  threadTimeline,
  renderedIncomingThreads,
  sortedIncomingThreads,
  threadOpsByKey,
  threadMessages,
  selectedThreadProfile,
  selectedMemberProfile,
  aiSuggestions, setAiSuggestions,
  loadingSuggestions,
  adminChatBoxRef,
  threadQueueRef,
  sendAdminReply,
  fetchAiSuggestions,
  saveQuickFacts,
  updateSelectedThreadTag,
  sendBulkTemplate,
  applyBulkThreadOps,
  exportStatsCsv,
  fetchThreadOperations,
  fetchRegisteredMembers,
  savePaymentSettings,
  uploadImage,
  createVirtualProfile,
  fillRandomVirtualProfile,
  openMemberDetails,
  saveMemberDetails,
  deleteMember,
  jumpToMemberChat,
  handleAdminThreadQueueScroll,
  setStatus,
  }) {
  return (
    <div className={`flex-1 flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] admin-panel ${adminDarkMode ? 'dark' : 'light'}`}>
      
      {/* Admin Left Sidebar */}
      <aside className="w-full lg:w-80 flex flex-col gap-4 overflow-y-auto">
         <div className="admin-bg rounded-2xl p-4 admin-border shadow-sm">
           <div className="flex items-center justify-between mb-3">
             <h3 className="text-sm font-bold admin-text3 uppercase tracking-wider">Mesaj Bekleyenler</h3>
             <button onClick={() => setAdminDarkMode((p) => !p)} className="px-2 py-1 rounded-lg text-xs font-bold admin-bg2 admin-text2 admin-border border transition" title="Tema değiştir">
               {adminDarkMode ? '☀️' : '🌙'}
             </button>
           </div>
           <div className="grid grid-cols-2 gap-2 mb-3">
             <button onClick={() => setThreadFilter((p) => ({ ...p, waitingOnly: !p.waitingOnly }))} className={`px-3 py-2.5 rounded-lg text-xs font-bold min-h-[44px] ${threadFilter.waitingOnly ? 'bg-indigo-100 text-indigo-700' : 'admin-bg2 admin-text2'}`}>Yanıt Bekleyen</button>
             <button onClick={() => setThreadFilter((p) => ({ ...p, slaRisk: !p.slaRisk }))} className={`px-3 py-2.5 rounded-lg text-xs font-bold min-h-[44px] ${threadFilter.slaRisk ? 'bg-rose-100 text-rose-700' : 'admin-bg2 admin-text2'}`}>SLA Riski</button>
             <button onClick={() => setThreadFilter((p) => ({ ...p, unassigned: !p.unassigned }))} className={`px-3 py-2.5 rounded-lg text-xs font-bold min-h-[44px] ${threadFilter.unassigned ? 'bg-amber-100 text-amber-700' : 'admin-bg2 admin-text2'}`}>Atanmamış</button>
             <button onClick={() => setThreadFilter((p) => ({ ...p, blacklist: !p.blacklist }))} className={`px-3 py-2.5 rounded-lg text-xs font-bold min-h-[44px] ${threadFilter.blacklist ? 'bg-slate-800 text-white' : 'admin-bg2 admin-text2'}`}>Blacklist</button>
           </div>
           <select value={threadSortMode} onChange={(e) => setThreadSortMode(e.target.value)} className="w-full mb-3 admin-input rounded-lg px-2 py-2 text-xs font-semibold admin-text2">
             <option value="sla_unread_recent">SLA + Unread + Son Mesaj</option>
             <option value="sla">SLA (Bekleme Süresi)</option>
             <option value="unread">Unread</option>
             <option value="recent">Son Mesaj</option>
           </select>
           <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto" ref={threadQueueRef} onScroll={handleAdminThreadQueueScroll}>
             {renderedIncomingThreads.map((thread) => {
               const isWait = thread.last_sender_role === 'member';
               const isActive = selectedThread?.member_id === thread.member_id && selectedThread?.virtual_profile_id === thread.virtual_profile_id;
               const key = threadKey(thread.member_id, thread.virtual_profile_id);
               const ops = threadOpsByKey[key] || {};
               const waitMin = thread.last_message_at ? Math.max(0, (Date.now() - new Date(thread.last_message_at).getTime()) / 60000) : 0;
                return (
                  <button key={key} onClick={() => setSelectedThread(thread)} className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isActive ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'admin-bg2 admin-border hover:border-slate-300'}`}>
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                        {thread.virtual_name?.slice(0, 1)}
                      </div>
                      {isWait && <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-white rounded-full" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold admin-text truncate">{thread.member_username} <span className="admin-text3 font-normal">→ {thread.virtual_name}</span></p>
                      <p className="text-xs admin-text3 truncate mt-0.5">{isWait ? 'Yanıt bekliyor...' : 'Yanıtlandı'}</p>
                     <div className="flex flex-wrap gap-1 mt-1">
                       {ops.priority && <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${ops.priority === 'high' ? 'bg-rose-100 text-rose-700' : ops.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{ops.priority.toUpperCase()}</span>}
                       {ops.assigned_admin ? <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">{ops.assigned_admin}</span> : <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-black">Atanmamış</span>}
                       {waitMin >= 15 && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">SLA Risk</span>}
                     </div>
                   </div>
                   <input
                     type="checkbox"
                     checked={!!selectedThreadKeys[key]}
                     onChange={(e) => {
                       const checked = e.target.checked;
                       setSelectedThreadKeys((prev) => ({ ...prev, [key]: checked }));
                     }}
                     onClick={(e) => e.stopPropagation()}
                     className="w-4 h-4 accent-indigo-600"
                     title="Toplu mesaj için seç"
                   />
                 </button>
               )
             })}
           </div>
         </div>

         <div className="admin-bg rounded-2xl p-4 admin-border shadow-sm">
            <h3 className="text-sm font-bold admin-text3 uppercase tracking-wider mb-3">Toplu Mesaj</h3>
            <p className="text-xs admin-text3 mb-3">Seçili sohbetlere tek seferde gönderim yap. Önce üstten sohbetleri işaretle.</p>
            <select value={bulkTemplate} onChange={(e) => setBulkTemplate(e.target.value)} className="w-full mb-2 admin-input rounded-xl px-3 py-2 text-sm admin-text">
              {BULK_TEMPLATES.map((tmpl) => <option key={tmpl} value={tmpl}>{tmpl}</option>)}
            </select>
            <textarea value={bulkTemplate} onChange={(e) => setBulkTemplate(e.target.value)} className="w-full admin-input rounded-xl p-3 text-sm min-h-[90px] focus:outline-none focus:border-indigo-400" placeholder="Toplu mesaj şablonu..." />
            <div className="mt-3 flex items-center gap-2">
              <button onClick={sendBulkTemplate} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm">Seçili Sohbetlere Gönder</button>
              <button onClick={() => setSelectedThreadKeys({})} className="px-3 py-2.5 admin-bg2 hover:bg-slate-200 admin-text2 rounded-xl text-sm font-semibold">Temizle</button>
            </div>
            <div className="mt-4 pt-3 border-t admin-border space-y-2">
              <h4 className="text-xs font-bold admin-text3 uppercase">Toplu Operasyon</h4>
              <select value={bulkPriority} onChange={(e) => setBulkPriority(e.target.value)} className="w-full admin-input rounded-lg px-2 py-2 text-xs admin-text2">
                <option value="">Öncelik Seç</option>
                <option value="high">Yüksek</option>
                <option value="medium">Orta</option>
                <option value="low">Düşük</option>
              </select>
              <select value={bulkStatusTag} onChange={(e) => setBulkStatusTag(e.target.value)} className="w-full admin-input rounded-lg px-2 py-2 text-xs admin-text2">
                <option value="">Tag Atama (opsiyonel)</option>
                {THREAD_TAGS.map((tag) => <option key={`bulk-${tag}`} value={tag}>{tag}</option>)}
              </select>
              <input value={bulkAssignTo} onChange={(e) => setBulkAssignTo(e.target.value)} placeholder="Sorumlu admin (örn: ayse_admin)" className="w-full admin-input rounded-lg px-2 py-2 text-xs admin-text2" />
              <input value={bulkFollowUpDate} onChange={(e) => setBulkFollowUpDate(e.target.value)} type="date" className="w-full admin-input rounded-lg px-2 py-2 text-xs admin-text2" />
              <select value={bulkBlacklistMode} onChange={(e) => setBulkBlacklistMode(e.target.value)} className="w-full admin-input rounded-lg px-2 py-2 text-xs admin-text2">
                <option value="ignore">Blacklist Değiştirme</option>
                <option value="true">Blacklist: Aç</option>
                <option value="false">Blacklist: Kapat</option>
              </select>
              <button onClick={applyBulkThreadOps} className="w-full bg-surface-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-sm">Tag/Öncelik/Takip Tarihi Uygula</button>
            </div>
         </div>

         <div className="admin-bg rounded-2xl p-4 admin-border shadow-sm">
            <h3 className="text-sm font-bold admin-text3 uppercase tracking-wider mb-3">SLA & Durum</h3>
            <div className="space-y-2 text-sm admin-text2">
              <div className="flex justify-between"><span className="admin-text2">Bekleyen Mesaj:</span> <strong className="text-rose-600">{slaStats.waitingCount}</strong></div>
              <div className="flex justify-between"><span className="admin-text2">Ort. Bekleme:</span> <strong className="admin-text">{slaStats.avgWaitMin > 0 && slaStats.avgWaitMin < 1 ? '<1 dk' : `${slaStats.avgWaitMin.toFixed(1)} dk`}</strong></div>
            </div>
         </div>
      </aside>

      {/* Admin Center - Chat Tab */}
      <main className="flex-1 admin-bg rounded-2xl admin-border shadow-sm flex flex-col overflow-hidden">
         {adminTab === 'chat' && (
           <>
              <div className="px-6 py-4 border-b admin-border flex items-center justify-between admin-bg2/50">
                <div>
                  <h2 className="text-lg font-bold admin-text">{selectedThread?.virtual_name || 'Lütfen bir sohbet seçin'}</h2>
                  <p className="text-xs font-semibold text-emerald-600">Sanal Profil Modülü</p>
                  {selectedThread && (
                    <p className="text-[11px] font-semibold admin-text3 mt-1">
                      Öncelik: {(threadOpsByKey[threadKey(selectedThread.member_id, selectedThread.virtual_profile_id)]?.priority || '-')} •
                      Sorumlu: {(threadOpsByKey[threadKey(selectedThread.member_id, selectedThread.virtual_profile_id)]?.assigned_admin || 'Atanmamış')}
                    </p>
                  )}
                </div>
                <select value={selectedThread?.status_tag || 'takip_edilecek'} onChange={(e) => updateSelectedThreadTag(e.target.value)} className="admin-bg border admin-border text-sm font-medium py-1.5 px-3 rounded-lg outline-none admin-text2">
                  {THREAD_TAGS.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
                </select>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={adminChatBoxRef}>
                 {!selectedThread && <div className="h-full flex items-center justify-center text-slate-500 font-medium">Soldan bir konuşma seçin.</div>}
                 {threadMessages.map((msg) => (
                   <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender_role === 'member' ? 'items-start mr-auto' : 'items-end ml-auto'}`}>
                      <span className="text-[11px] font-bold text-slate-500 mb-1 px-1">
                        {msg.sender_role === 'member' ? selectedThread?.member_username : selectedThread?.virtual_name}
                      </span>
                      <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${msg.sender_role === 'member' ? 'bg-slate-800 text-white msg-tail-member' : 'bg-indigo-600 text-white msg-tail-virtual'}`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 px-1">{formatTime(msg.created_at)}</span>
                   </div>
                 ))}
              </div>

              <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
                 {!!aiSuggestions.length && (
                   <div className="flex flex-wrap gap-2">
                     {aiSuggestions.map((sugg) => (
                       <button key={sugg} onClick={() => setAdminReply(sugg)} className="px-3 py-1.5 bg-brand-50 text-fuchsia-700 hover:bg-fuchsia-100 text-xs font-semibold rounded-full border border-fuchsia-200 transition-colors">
                         ✨ {sugg}
                       </button>
                     ))}
                   </div>
                 )}
                 <div className="flex items-end gap-3">
                   <button onClick={fetchAiSuggestions} disabled={loadingSuggestions} className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-slate-800 hover:bg-slate-200 text-slate-300 rounded-xl transition-colors" title="AI Önerisi Al">
                      🤖
                   </button>
                   <textarea
                     value={adminReply}
                     onChange={(e) => { setAdminReply(e.target.value); autoResizeTextarea(e.target, 150); }}
                     onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAdminReply(); } }}
                     placeholder="Kullanıcıya yanıt yazın..."
                     className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none min-h-[48px]"
                   />
                   <button onClick={sendAdminReply} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors h-12">
                     Gönder
                   </button>
                 </div>
              </div>
           </>
         )}
         
         {/* Admin Center - Stats Tab */}
         {adminTab === 'stats' && (
           <div className="p-6 md:p-8 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-white">Stats Dashboard ({statsRange === 'daily' ? 'Günlük' : statsRange === 'weekly' ? 'Haftalık' : 'Aylık'})</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={() => setStatsRange('daily')} className={`px-4 py-2 rounded-xl font-bold ${statsRange === 'daily' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Günlük</button>
                <button onClick={() => setStatsRange('weekly')} className={`px-4 py-2 rounded-xl font-bold ${statsRange === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Haftalık</button>
                <button onClick={() => setStatsRange('monthly')} className={`px-4 py-2 rounded-xl font-bold ${statsRange === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Aylık</button>
                <button onClick={exportStatsCsv} className="px-4 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white">CSV Export</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                <label className="text-xs font-bold text-slate-400">Tarih Başlangıç
                  <input type="date" value={statsDateRange.from} onChange={(e) => setStatsDateRange((p) => ({ ...p, from: e.target.value }))} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm" />
                </label>
                <label className="text-xs font-bold text-slate-400">Tarih Bitiş
                  <input type="date" value={statsDateRange.to} onChange={(e) => setStatsDateRange((p) => ({ ...p, to: e.target.value }))} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm" />
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                 <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700"><p className="text-sm text-slate-400 font-semibold mb-1">Toplam Mesaj</p><p className="text-3xl font-black text-white">{adminStats.totalMessagesToday}</p><p className={`text-xs font-bold ${pctChange(adminStats.totalMessagesToday, previousAdminStats.totalMessagesToday) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{pctChange(adminStats.totalMessagesToday, previousAdminStats.totalMessagesToday).toFixed(1)}%</p></div>
                 <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700"><p className="text-sm text-slate-400 font-semibold mb-1">Üye Mesajı</p><p className="text-3xl font-black text-white">{adminStats.memberMessagesToday}</p><p className={`text-xs font-bold ${pctChange(adminStats.memberMessagesToday, previousAdminStats.memberMessagesToday) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{pctChange(adminStats.memberMessagesToday, previousAdminStats.memberMessagesToday).toFixed(1)}%</p></div>
                 <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700"><p className="text-sm text-slate-400 font-semibold mb-1">Admin Cevabı</p><p className="text-3xl font-black text-white">{adminStats.adminRepliesToday}</p><p className={`text-xs font-bold ${pctChange(adminStats.adminRepliesToday, previousAdminStats.adminRepliesToday) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{pctChange(adminStats.adminRepliesToday, previousAdminStats.adminRepliesToday).toFixed(1)}%</p></div>
                 <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700"><p className="text-sm text-slate-400 font-semibold mb-1">Cevaplanan Thread</p><p className="text-3xl font-black text-white">{adminStats.respondedThreadsToday}</p><p className={`text-xs font-bold ${pctChange(adminStats.respondedThreadsToday, previousAdminStats.respondedThreadsToday) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{pctChange(adminStats.respondedThreadsToday, previousAdminStats.respondedThreadsToday).toFixed(1)}%</p></div>
                 <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700"><p className="text-sm text-slate-400 font-semibold mb-1">Yeni Üye Kaydı</p><p className="text-3xl font-black text-white">{adminStats.newMembersToday}</p><p className={`text-xs font-bold ${pctChange(adminStats.newMembersToday, previousAdminStats.newMembersToday) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{pctChange(adminStats.newMembersToday, previousAdminStats.newMembersToday).toFixed(1)}%</p></div>
                 <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700"><p className="text-sm text-slate-400 font-semibold mb-1">Aktif Thread</p><p className="text-3xl font-black text-white">{adminStats.activeThreadsToday}</p><p className={`text-xs font-bold ${pctChange(adminStats.activeThreadsToday, previousAdminStats.activeThreadsToday) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{pctChange(adminStats.activeThreadsToday, previousAdminStats.activeThreadsToday).toFixed(1)}%</p></div>
                 <div className={`p-4 rounded-2xl border md:col-span-2 xl:col-span-1 ${adminStats.avgResponseMinToday > 7 ? 'bg-rose-50 border-rose-200' : 'bg-slate-800 border-slate-700'}`}><p className="text-sm text-slate-400 font-semibold mb-1">Ort. Cevap Süresi</p><p className="text-3xl font-black text-white">{adminStats.avgResponseMinToday.toFixed(1)} <span className="text-sm">dk</span></p><p className={`text-xs font-bold ${pctChange(adminStats.avgResponseMinToday, previousAdminStats.avgResponseMinToday) <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{pctChange(adminStats.avgResponseMinToday, previousAdminStats.avgResponseMinToday).toFixed(1)}%</p></div>
              </div>
              {!!statsAlerts.length && (
                <div className="mb-4 p-4 rounded-2xl border border-rose-200 bg-rose-50">
                  <h4 className="text-sm font-black text-rose-700 mb-2">Kritik Alarm</h4>
                  <ul className="text-xs text-rose-700 list-disc pl-4 space-y-1">
                    {statsAlerts.map((alert) => <li key={alert}>{alert}</li>)}
                  </ul>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
                  <h3 className="text-xl font-bold text-slate-200 mb-2">Engagement (7 Gün)</h3>
                  <p className="text-sm font-semibold text-slate-300 mb-2">Yoğun saatler:</p>
                  <div className="flex flex-wrap gap-2">
                    {engagementInsights.topHours.length ? engagementInsights.topHours.map((item) => (
                      <span key={item.label} className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">{item.label} ({item.count})</span>
                    )) : <span className="text-sm text-slate-500">Veri yok</span>}
                  </div>
                  <div className="mt-3 flex items-end gap-1 h-16">
                    {engagementInsights.topHours.length ? engagementInsights.topHours.map((item) => (
                      <div key={`chart-${item.label}`} className="flex-1 flex flex-col items-center justify-end gap-1">
                        <div className="w-full rounded-t bg-indigo-400/80" style={{ height: `${Math.max(10, item.count * 8)}px` }} />
                        <span className="text-[10px] text-slate-400">{item.label.slice(0, 2)}</span>
                      </div>
                    )) : <span className="text-xs text-slate-500">Mini chart için veri yok.</span>}
                  </div>
                </div>
                <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
                  <h3 className="text-xl font-bold text-slate-200 mb-2">İlgi gören profiller:</h3>
                  <div className="space-y-2">
                    {engagementInsights.topProfiles.length ? engagementInsights.topProfiles.map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm">
                        <span className="font-semibold text-slate-700">{item.name}</span>
                        <span className="font-black text-indigo-700">{item.count} <span className="text-[10px] text-slate-500">▁▃▆█</span></span>
                      </div>
                    )) : <span className="text-sm text-slate-500">Veri yok</span>}
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-2xl border border-emerald-200 bg-emerald-50">
                <h4 className="text-sm font-black text-emerald-800 mb-2">Önerilen Aksiyonlar</h4>
                <ul className="text-xs text-emerald-900 list-disc pl-4 space-y-1">
                  <li>Bulk mesajı şu saatlerde dene: {engagementInsights.topHours.map((h) => h.label).join(', ') || 'veri yok'}.</li>
                  <li>Boost önceliği verilecek profiller: {engagementInsights.topProfiles.map((p) => p.name).join(', ') || 'veri yok'}.</li>
                </ul>
              </div>
           </div>
         )}

         {/* Admin Center - Settings Tab (MISSING CODE RESTORED HERE) */}
         {adminTab === 'settings' && (
           <div className="p-6 md:p-8 overflow-y-auto space-y-8">
              
              {/* General Settings */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Genel Ayarlar</h3>
                <label className="flex items-center justify-between cursor-pointer max-w-md">
                  <span className="font-semibold text-slate-700">Bildirim Sesi Aktif</span>
                  <input type="checkbox" checked={notificationSoundEnabled} onChange={(e) => setNotificationSoundEnabled(e.target.checked)} className="w-5 h-5 accent-indigo-600 cursor-pointer" />
                </label>
              </div>

              {/* Create Virtual Profile */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Sanal Profil Oluştur</h3>
                  <button onClick={fillRandomVirtualProfile} className="text-xl bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 hover:bg-slate-800 transition-colors shadow-sm" title="Rastgele Doldur">🎲 Doldur</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input placeholder="Ad (boşsa otomatik)" value={profileForm.name} onChange={(e) => setProfileForm((s) => ({ ...s, name: e.target.value }))} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
                  <input placeholder="Yaş (boşsa otomatik)" type="number" value={profileForm.age} onChange={(e) => setProfileForm((s) => ({ ...s, age: e.target.value }))} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
                  <input placeholder="Şehir (boşsa otomatik)" value={profileForm.city} onChange={(e) => setProfileForm((s) => ({ ...s, city: e.target.value }))} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
                  <select value={profileForm.gender} onChange={(e) => setProfileForm((s) => ({ ...s, gender: e.target.value }))} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500">
                    <option value="Kadın">Kadın</option>
                    <option value="Erkek">Erkek</option>
                  </select>
                  <textarea placeholder="Hobiler (virgülle ayırın)" value={profileForm.hobbies} onChange={(e) => setProfileForm((s) => ({ ...s, hobbies: e.target.value }))} className="md:col-span-2 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 min-h-[80px]" />
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                   <label className="bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-800 transition-colors shadow-sm">
                     📸 Fotoğraf Yükle
                     <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadImage(file, 'virtual-profiles'); if (url) setProfileForm((s) => ({ ...s, photo_url: url })); }} />
                   </label>
                   {profileForm.photo_url && <img loading="lazy" src={profileForm.photo_url} alt="Yüklenen fotoğraf önizlemesi" className="w-16 h-16 object-cover rounded-xl border border-slate-700 shadow-sm" />}
                </div>

                <button onClick={createVirtualProfile} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors">
                  Profili Kaydet (Oto Üretim Dahil)
                </button>
              </div>

              {/* Member List */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Kayıtlı Kullanıcılar</h3>
                  <button onClick={fetchRegisteredMembers} className="text-sm bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-800 font-bold">Yenile</button>
                </div>
                {loadingMembers ? (
                  <p className="text-slate-400 font-medium">Kullanıcılar yükleniyor...</p>
                ) : (
                  <div className="space-y-3">
                    {registeredMembers.map((member) => (
                      <div key={member.id} onClick={() => openMemberDetails(member)} className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-sm hover:bg-slate-800 cursor-pointer transition-colors group text-left">
                        <div className="min-w-0 pr-4">
                          <p className="font-bold text-white truncate flex items-center gap-2" title={member.username}>
                            {member.username}
                            <span className="text-xs font-semibold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">🔍 Detaylar</span>
                          </p>
                          <p className="text-xs font-semibold text-slate-500 mt-1">Kayıt: {new Date(member.created_at).toLocaleString('tr-TR')}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-bold">
                            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md">Jeton: {member.coin_balance ?? 100}</span>
                            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">İletişim: {member.contact_phone || '-'}</span>
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); if(window.confirm('Bu kullanıcıyı tamamen silmek istediğine emin misin?')) deleteMember(member.id); }} className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 font-bold text-sm rounded-xl transition-colors shrink-0">
                          Sil
                        </button>
                      </div>
                    ))}
                    {!registeredMembers.length && <p className="text-slate-400 font-medium bg-slate-900 p-4 rounded-xl border border-slate-700">Henüz kayıtlı kullanıcı bulunmuyor.</p>}
                  </div>
                )}
              </div>

           </div>
         )}

         {/* Admin Center - Payments Tab (MISSING CODE RESTORED HERE) */}
         {adminTab === 'payments' && (
           <div className="p-6 md:p-8 overflow-y-auto">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-2xl">
                <h3 className="text-lg font-bold text-white mb-2">Ödeme API Entegrasyonu</h3>
                <p className="text-sm text-slate-300 font-medium mb-6">Coin satın alma akışı belirtilen Checkout Session endpointine otomatik gider. Sistem doğrudan bu altyapıyı kullanır.</p>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Provider (örn: stripe, paytr)</label>
                    <input placeholder="Provider girin" value={paymentSettings.provider} onChange={(e) => setPaymentSettings((prev) => ({ ...prev, provider: e.target.value }))} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Checkout Endpoint URL</label>
                    <input
                      value={paymentSettings.webhook_url}
                      onChange={(e) => setPaymentSettings((prev) => ({ ...prev, webhook_url: e.target.value }))}
                      placeholder={DEFAULT_CHECKOUT_ENDPOINT}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-xs text-slate-400 font-medium mt-2">Webhook callback adresi: <code className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">/api/webhook</code></p>
                  </div>

                  <label className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer shadow-sm mt-4 hover:border-emerald-300 transition-colors">
                    <span className="font-bold text-slate-700">Entegrasyon Aktif</span>
                    <input type="checkbox" checked={paymentSettings.is_active} onChange={(e) => setPaymentSettings((prev) => ({ ...prev, is_active: e.target.checked }))} className="w-5 h-5 accent-emerald-500 cursor-pointer" />
                  </label>

                  <button onClick={savePaymentSettings} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors mt-2">
                    Ödeme Ayarlarını Kaydet
                  </button>
                </div>
              </div>
           </div>
         )}
      </main>

      {/* Admin Right Sidebar */}
      {adminDrawerOpen && adminTab === 'chat' && (
        <aside className="w-full lg:w-80 flex flex-col gap-4 overflow-y-auto">
           <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700 shadow-sm flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden mb-3 border-4 border-white shadow-md">
                {selectedThreadProfile?.photo_url ? <img loading="lazy" src={selectedThreadProfile.photo_url} alt={`${selectedThreadProfile.name} profil fotoğrafı`} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-indigo-100" />}
              </div>
              <h3 className="text-lg font-bold text-white">{selectedThreadProfile?.name || '-'}</h3>
              <p className="text-sm text-slate-400 font-medium">{selectedThreadProfile?.age} • {selectedThreadProfile?.city}</p>
           </div>

           <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700 shadow-sm">
              <h4 className="text-sm font-bold text-white mb-3">Sohbet Edilen Kullanıcı</h4>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 border border-slate-700 shadow-sm">
                  {selectedMemberProfile?.photo_url ? <img loading="lazy" src={selectedMemberProfile.photo_url} alt={`${selectedThread?.member_username || 'Kullanıcı'} profil fotoğrafı`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">{(selectedThread?.member_username || '?').slice(0,1).toUpperCase()}</div>}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{selectedThread?.member_username || 'Kullanıcı seçilmedi'}</p>
                  <p className="text-xs text-slate-400">{selectedMemberProfile?.age ? `${selectedMemberProfile.age} yaş` : '-'} • {selectedMemberProfile?.city || 'Şehir yok'}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3">Hobiler: <span className="font-medium text-slate-700">{selectedMemberProfile?.hobbies || 'Belirtilmemiş'}</span></p>
           </div>
           
           <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-sm">
              <h4 className="text-sm font-bold text-white mb-2">Hızlı Notlar (Quick Facts)</h4>
              <textarea value={quickFactsText} onChange={(e)=>setQuickFactsText(e.target.value)} placeholder="Kullanıcı sınırları, özel istekleri..." className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:outline-none min-h-[100px]" />
              <button onClick={saveQuickFacts} className="w-full mt-2 bg-surface-900 text-white text-xs font-bold py-2 rounded-lg">Notları Kaydet</button>
           </div>

           <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-sm">
              <h4 className="text-sm font-bold text-white mb-2">İşlem Geçmişi (Timeline)</h4>
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {threadTimeline.length ? threadTimeline.map((event, idx) => (
                  <div key={`${event.event_type}-${event.created_at}-${idx}`} className="text-xs rounded-lg border border-slate-700 bg-slate-800 p-2">
                    <p className="font-bold text-slate-700">{event.event_type}</p>
                    <p className="text-slate-400 mt-0.5">{formatTime(event.created_at)}</p>
                    {!!event.meta && <p className="text-slate-300 mt-1 break-words">{JSON.stringify(event.meta)}</p>}
                  </div>
                )) : <p className="text-xs text-slate-500">Henüz kayıtlı olay yok.</p>}
              </div>
           </div>
         </aside>
      )}

      {/* User Details Modal (for Admin) */}
      {adminMemberDetailOpen && selectedAdminMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in text-left">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg">
                  {selectedAdminMember.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{selectedAdminMember.username}</h3>
                  <p className="text-xs font-semibold text-slate-500">ID: {selectedAdminMember.id}</p>
                </div>
              </div>
              <button onClick={() => setAdminMemberDetailOpen(false)} className="text-slate-400 hover:text-white text-xl font-bold bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors">✕</button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Profile Info & Form */}
              <div className="space-y-5">
                <h4 className="text-sm font-black text-indigo-400 uppercase tracking-wider">Profil Bilgileri</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Yaş</label>
                    <input type="number" placeholder="Yaş girin" value={selectedAdminMember.age || ''} onChange={(e) => setSelectedAdminMember(prev => ({ ...prev, age: parseInt(e.target.value) || null }))} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-white" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Şehir</label>
                    <input type="text" placeholder="Şehir girin" value={selectedAdminMember.city || ''} onChange={(e) => setSelectedAdminMember(prev => ({ ...prev, city: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Durum Emojisi</label>
                  <input type="text" placeholder="Emoji girin (örn: 🙂)" value={selectedAdminMember.status_emoji || ''} onChange={(e) => setSelectedAdminMember(prev => ({ ...prev, status_emoji: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-white" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">İletişim Telefonu</label>
                  <input type="text" placeholder="Telefon numarası" value={selectedAdminMember.contact_phone || ''} onChange={(e) => setSelectedAdminMember(prev => ({ ...prev, contact_phone: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-white" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Jeton Bakiyesi</label>
                  <input type="number" placeholder="Jeton miktarı" value={selectedAdminMember.coin_balance ?? 100} onChange={(e) => setSelectedAdminMember(prev => ({ ...prev, coin_balance: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-white" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hobiler</label>
                  <textarea placeholder="Hobileri virgülle ayırarak girin..." value={selectedAdminMember.hobbies || ''} onChange={(e) => setSelectedAdminMember(prev => ({ ...prev, hobbies: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-white min-h-[80px]" />
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl flex flex-col gap-2 text-xs font-semibold text-slate-400">
                  <p>Kayıt Tarihi: <span className="text-white">{new Date(selectedAdminMember.created_at).toLocaleString('tr-TR')}</span></p>
                  <p>Toplam Gönderilen Mesaj: <span className="text-indigo-400 font-bold">{adminMemberMessageCount}</span></p>
                </div>
              </div>

              {/* Right Column: Moderation & Chat History */}
              <div className="space-y-6 flex flex-col h-full min-h-[300px]">
                {/* Moderation */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-rose-400 uppercase tracking-wider">Moderasyon ve Yasaklama</h4>
                  
                  <label className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer shadow-sm hover:border-rose-500/30 transition-colors">
                    <span className="font-bold text-slate-200 text-sm">Kara Listede (Yasaklı)</span>
                    <input type="checkbox" checked={!!selectedAdminMember.is_blacklisted} onChange={(e) => setSelectedAdminMember(prev => ({ ...prev, is_blacklisted: e.target.checked }))} className="w-5 h-5 accent-rose-500 cursor-pointer" />
                  </label>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Susturulma Süresi (Muted Until)</label>
                    <input type="datetime-local" value={selectedAdminMember.muted_until ? new Date(selectedAdminMember.muted_until).toLocaleString('sv-SE').slice(0, 16).replace(' ', 'T') : ''} onChange={(e) => setSelectedAdminMember(prev => ({ ...prev, muted_until: e.target.value ? new Date(e.target.value).toISOString() : null }))} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-white" />
                    <p className="text-[10px] text-slate-500 mt-1">Boş bırakırsanız kullanıcının konuşma engeli olmayacaktır.</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Moderasyon Notları</label>
                    <textarea placeholder="Yönetici notları..." value={selectedAdminMember.moderation_notes || ''} onChange={(e) => setSelectedAdminMember(prev => ({ ...prev, moderation_notes: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-white min-h-[70px]" />
                  </div>
                </div>

                {/* Chat History */}
                <div className="flex-1 flex flex-col min-h-0">
                  <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider mb-3">Sohbet Geçmişi</h4>
                  <div className="flex-1 overflow-y-auto space-y-2 max-h-[220px] pr-1">
                    {adminMemberThreads.map((thread) => (
                      <div key={`${thread.member_id}::${thread.virtual_profile_id}`} onClick={() => jumpToMemberChat(thread)} className="p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-500/30 hover:bg-slate-900 cursor-pointer transition-all flex justify-between items-start text-xs text-left">
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-200">{thread.virtual_name} ile sohbet</p>
                          <p className="text-slate-400 truncate mt-1">{thread.last_message_content || 'Mesaj yok'}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-slate-500 font-semibold">{new Date(thread.last_message_at).toLocaleDateString('tr-TR')}</p>
                          <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${thread.status_tag === 'closed' ? 'bg-slate-800 text-slate-500' : 'bg-emerald-500/10 text-emerald-400'}`}>{thread.status_tag}</span>
                        </div>
                      </div>
                    ))}
                    {!adminMemberThreads.length && <p className="text-slate-500 italic text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl">Kullanıcıya ait aktif sohbet bulunamadı.</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-850 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
              <button onClick={() => { if(window.confirm('Bu kullanıcıyı tamamen silmek istediğine emin misin?')) { deleteMember(selectedAdminMember.id); setAdminMemberDetailOpen(false); } }} className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-sm rounded-xl border border-rose-500/20 transition-colors">
                Kullanıcıyı Tamamen Sil
              </button>
              
              <div className="flex items-center gap-3">
                <button onClick={() => setAdminMemberDetailOpen(false)} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-colors">
                  Kapat
                </button>
                <button onClick={saveMemberDetails} disabled={savingMemberDetail} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-md transition-colors">
                  {savingMemberDetail ? 'Kaydediliyor...' : 'Bilgileri Güncelle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
