import { COIN_COST_PER_MESSAGE, formatTime } from '../../appConstants';

export default function ChatPage({
  renderedUserProfiles, selectedProfileId, setSelectedProfileId, mobileViewMode, setMobileViewMode,
  effectiveOnlineProfiles, messages, selectedProfile, newMessage, setNewMessage,
  sendMessage, typingLabel, coinSpendFeedback, unreadByProfile,
  chatBoxRef, latestMemberMessageRef, messageInputRef, focusedMessageId,
  handleUserProfileListScroll, profileListRef
}) {
  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 bg-slate-900 rounded-[2rem] border border-slate-700 shadow-sm overflow-hidden h-[calc(100vh-210px)] md:h-[calc(100vh-140px)] min-h-0">
      <div className={`w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-800/50 h-full min-h-0 ${mobileViewMode === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 border-b border-slate-800">
          <h3 className="text-xl font-black text-white">Mesajlarım</h3>
        </div>
        <div
          className="overflow-y-auto p-3 space-y-2"
          ref={profileListRef}
          onScroll={handleUserProfileListScroll}
          style={{ maxHeight: `${7 * 74}px` }}
        >
          {renderedUserProfiles.map(p => (
            <button key={p.id} onClick={() => { setSelectedProfileId(p.id); setMobileViewMode('chat'); }} className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${selectedProfileId === p.id ? 'bg-slate-900 shadow-sm border border-slate-700' : 'hover:bg-slate-800 border border-transparent'}`}>
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                  {p.photo_url ? <img loading="lazy" src={p.photo_url} alt={`${p.name} profil fotoğrafı`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">{p.name.slice(0,1)}</div>}
                </div>
                {effectiveOnlineProfiles[p.id] && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-bold text-white truncate">{p.name}</p>
                <p className="text-xs text-slate-400 truncate">{p.city}</p>
              </div>
              {unreadByProfile[p.id] > 0 && <span className="w-5 h-5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">{unreadByProfile[p.id]}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className={`flex-1 flex flex-col bg-slate-900 relative h-full min-h-0 ${mobileViewMode === 'list' ? 'hidden md:flex' : 'flex'}`}>
         {!selectedProfile ? (
           <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
             <span className="text-4xl mb-4">💬</span>
             <p className="font-medium">Sohbet etmek için bir profil seçin.</p>
           </div>
         ) : (
           <>
             <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-4 bg-slate-900 z-10 shadow-sm">
               <button
                 onClick={() => setMobileViewMode('list')}
                 className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
                 title="Mesajlara geri dön"
               >
                 ←
               </button>
               <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                  {selectedProfile.photo_url && <img loading="lazy" src={selectedProfile.photo_url} alt={`${selectedProfile.name} profil fotoğrafı`} className="w-full h-full object-cover" />}
               </div>
               <div className="flex-1 min-w-0">
                 <h3 className="font-bold text-white leading-tight">{selectedProfile.name}</h3>
                 <p className="text-xs font-semibold text-emerald-500">{effectiveOnlineProfiles[selectedProfile.id] ? 'Çevrimiçi' : 'Çevrimdışı'}</p>
                 <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                   <div className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800">
                     <p className="font-bold text-slate-400 uppercase tracking-wide">Şehir</p>
                     <p className="font-semibold text-slate-700 truncate">{selectedProfile.city || 'Belirtilmemiş'}</p>
                   </div>
                   <div className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800">
                     <p className="font-bold text-slate-400 uppercase tracking-wide">Yaş</p>
                     <p className="font-semibold text-slate-700">{selectedProfile.age || '-'}</p>
                   </div>
                   <div className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800">
                     <p className="font-bold text-slate-400 uppercase tracking-wide">Hobiler</p>
                     <p className="font-semibold text-slate-700 truncate">{selectedProfile.hobbies || 'Belirtilmemiş'}</p>
                   </div>
                 </div>
               </div>
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-fuchsia-50/70 via-white to-slate-50 border-y border-slate-700 shadow-inner" ref={chatBoxRef}>
               {messages.map(msg => {
                 const isFocusedMemberMessage = msg.sender_role === 'member' && msg.id === focusedMessageId;
                 return (
                 <div
                   key={msg.id}
                   ref={isFocusedMemberMessage ? latestMemberMessageRef : null}
                   className={`flex flex-col max-w-[75%] scroll-mt-28 ${msg.sender_role === 'member' ? 'items-end ml-auto' : 'items-start mr-auto'}`}
                 >
                   <div className={`px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-300 ${msg.sender_role === 'member' ? 'bg-brand-500 text-white msg-tail-member' : 'bg-slate-900 border border-slate-700 text-slate-200 msg-tail-virtual'} ${isFocusedMemberMessage ? 'ring-4 ring-fuchsia-300/70 shadow-xl scale-[1.02]' : ''}`}>
                     <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                   </div>
                   <div className="flex items-center gap-1 mt-1 px-1">
                     <span className="text-[10px] text-slate-500 font-medium">{formatTime(msg.created_at)}</span>
                     {msg.sender_role === 'member' && <span className={`text-[10px] font-bold ${msg.seen_by_admin ? 'text-blue-500' : 'text-slate-300'}`}>✓✓</span>}
                   </div>
                 </div>
               );})}
               {typingLabel && <div className="text-xs font-bold text-slate-500 ml-2 animate-pulse">{typingLabel}</div>}
             </div>

             <div className="p-4 bg-slate-900 border-t border-slate-800 shadow-[0_-12px_30px_rgba(217,70,239,0.08)]">
               <div className="flex items-center justify-between mb-2 px-1">
                 <p className="text-xs font-bold text-slate-400">Mesaj gönderim maliyeti: <span className="text-amber-400">{COIN_COST_PER_MESSAGE} jeton</span></p>
                 <p className="hidden sm:block text-[11px] font-black uppercase tracking-wide text-fuchsia-500">Enter ile gönder · Shift+Enter yeni satır</p>
                 {coinSpendFeedback && <span className="text-xs font-black text-rose-600">{coinSpendFeedback}</span>}
               </div>
               <div className="flex items-center gap-3 bg-slate-950 border border-slate-700/80 rounded-3xl p-3 shadow-lg shadow-fuchsia-500/5 focus-within:border-fuchsia-500 focus-within:ring-2 focus-within:ring-fuchsia-500/20 transition-all">
                 <textarea
                   ref={messageInputRef}
                   value={newMessage}
                   onChange={(e) => setNewMessage(e.target.value)}
                   onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                   placeholder="Mesajınızı yazın..."
                   className="flex-1 bg-transparent px-3 py-1.5 text-base font-bold text-white placeholder:text-slate-500 focus:outline-none resize-none h-12 overflow-y-auto"
                 />
                 <button onClick={sendMessage} className="w-12 h-12 flex items-center justify-center bg-brand-500 hover:bg-brand-600 text-white rounded-2xl shadow-md shadow-fuchsia-500/30 transition-transform active:scale-95">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                 </button>
               </div>
             </div>
           </>
         )}
      </div>
    </div>
  );
}
