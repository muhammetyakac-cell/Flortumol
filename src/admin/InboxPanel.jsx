import { useInboxState } from '../hooks/admin/useInboxState';
import { EmptyState } from '../components/admin/EmptyState';

export function InboxPanel({
  selectedThread,
  threadOpsByKey,
  threadKey,
  THREAD_TAGS,
  updateSelectedThreadTag,
  threadMessages,
  formatTime,
  aiSuggestions,
  loadingSuggestions,
  fetchAiSuggestions,
  adminReply,
  setAdminReply,
  sendAdminReply,
  autoResizeTextarea,
  chatBoxRef,
}) {
  const { replyDraft, setReplyDraft } = useInboxState(adminReply);

  return (
    <>
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{selectedThread?.virtual_name || 'Lütfen bir sohbet seçin'}</h2>
          <p className="text-xs font-semibold text-emerald-600">Sanal Profil Modülü</p>
          {selectedThread && (
            <p className="text-[11px] font-semibold text-slate-500 mt-1">
              Öncelik: {(threadOpsByKey[threadKey(selectedThread.member_id, selectedThread.virtual_profile_id)]?.priority || '-')} •
              Sorumlu: {(threadOpsByKey[threadKey(selectedThread.member_id, selectedThread.virtual_profile_id)]?.assigned_admin || 'Atanmamış')}
            </p>
          )}
        </div>
        <select value={selectedThread?.status_tag || 'takip_edilecek'} onChange={(e) => updateSelectedThreadTag(e.target.value)} className="bg-white border border-slate-200 text-sm font-medium py-1.5 px-3 rounded-lg outline-none">
          {THREAD_TAGS.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={chatBoxRef}>
        {!selectedThread && <EmptyState message="Soldan bir konuşma seçin." />}
        {threadMessages.map((msg) => (
          <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender_role === 'member' ? 'items-start mr-auto' : 'items-end ml-auto'}`}>
            <span className="text-[11px] font-bold text-slate-400 mb-1 px-1">
              {msg.sender_role === 'member' ? selectedThread?.member_username : selectedThread?.virtual_name}
            </span>
            <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${msg.sender_role === 'member' ? 'bg-slate-100 text-slate-900 msg-tail-member' : 'bg-indigo-600 text-white msg-tail-virtual'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{formatTime(msg.created_at)}</span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 space-y-3">
        {!!aiSuggestions.length && (
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((sugg) => (
              <button key={sugg} onClick={() => { setReplyDraft(sugg); setAdminReply(sugg); }} className="px-3 py-1.5 bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100 text-xs font-semibold rounded-full border border-fuchsia-200 transition-colors">
                ✨ {sugg}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-3">
          <button onClick={fetchAiSuggestions} disabled={loadingSuggestions} className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors" title="AI Önerisi Al">🤖</button>
          <textarea
            value={replyDraft}
            onChange={(e) => { setReplyDraft(e.target.value); setAdminReply(e.target.value); autoResizeTextarea(e.target, 150); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAdminReply(); } }}
            placeholder="Kullanıcıya yanıt yazın..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none min-h-[48px]"
          />
          <button onClick={sendAdminReply} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors h-12">Gönder</button>
        </div>
      </div>
    </>
  );
}
