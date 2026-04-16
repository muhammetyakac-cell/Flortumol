import { AdminCard } from '../components/admin/AdminCard';
import { SectionHeader } from '../components/admin/SectionHeader';
import { StatusPill } from '../components/admin/StatusPill';
import { AdminInput } from '../components/admin/AdminInput';
import { AdminToggle } from '../components/admin/AdminToggle';
import { AdminPrimaryButton } from '../components/admin/AdminPrimaryButton';

export function ModerationPanel({
  className = '',
  selectedThread,
  selectedThreadProfile,
  selectedMemberProfile,
  quickFactsText,
  setQuickFactsText,
  saveQuickFacts,
  threadTimeline,
  formatTime,
  memberModeration,
  setMemberModeration,
  saveMemberModeration,
}) {
  return (
    <div className={`p-6 md:p-8 overflow-y-auto space-y-4 ${className}`.trim()}>
      <AdminCard className="p-5 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden mb-3 border-4 border-white shadow-md">
          {selectedThreadProfile?.photo_url ? <img src={selectedThreadProfile.photo_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-indigo-100" />}
        </div>
        <h3 className="text-lg font-bold text-slate-900">{selectedThreadProfile?.name || '-'}</h3>
        <p className="text-sm text-slate-500 font-medium">{selectedThreadProfile?.age} • {selectedThreadProfile?.city}</p>
      </AdminCard>

      <AdminCard className="p-5">
        <SectionHeader title="Sohbet Edilen Kullanıcı" />
        <div className="flex items-center gap-3 mt-3">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 border border-slate-200 shadow-sm">
            {selectedMemberProfile?.photo_url ? <img src={selectedMemberProfile.photo_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">{(selectedThread?.member_username || '?').slice(0, 1).toUpperCase()}</div>}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 truncate">{selectedThread?.member_username || 'Kullanıcı seçilmedi'}</p>
            <p className="text-xs text-slate-500">{selectedMemberProfile?.age ? `${selectedMemberProfile.age} yaş` : '-'} • {selectedMemberProfile?.city || 'Şehir yok'}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">Hobiler: <span className="font-medium text-slate-700">{selectedMemberProfile?.hobbies || 'Belirtilmemiş'}</span></p>
      </AdminCard>

      <AdminCard className="p-4">
        <SectionHeader title="Moderasyon" />
        <div className="mt-3 space-y-2">
          <AdminInput as="textarea" value={memberModeration.note} onChange={(e) => setMemberModeration((s) => ({ ...s, note: e.target.value }))} placeholder="Moderasyon notu" className="min-h-[80px]" />
          <AdminInput value={memberModeration.tags} onChange={(e) => setMemberModeration((s) => ({ ...s, tags: e.target.value }))} placeholder="Etiketler (virgülle)" />
          <AdminToggle label="Blacklist" checked={memberModeration.blacklisted} onChange={(e) => setMemberModeration((s) => ({ ...s, blacklisted: e.target.checked }))} />
          <StatusPill tone={memberModeration.blacklisted ? 'danger' : 'success'}>{memberModeration.blacklisted ? 'Kara listede' : 'Aktif'}</StatusPill>
          <AdminPrimaryButton onClick={saveMemberModeration} className="w-full py-2">Moderasyonu Kaydet</AdminPrimaryButton>
        </div>
      </AdminCard>

      <AdminCard className="p-4">
        <h4 className="text-sm font-bold text-slate-900 mb-2">Hızlı Notlar (Quick Facts)</h4>
        <AdminInput as="textarea" value={quickFactsText} onChange={(e) => setQuickFactsText(e.target.value)} placeholder="Kullanıcı sınırları, özel istekleri..." className="min-h-[100px]" />
        <AdminPrimaryButton onClick={saveQuickFacts} className="w-full mt-2 py-2">Notları Kaydet</AdminPrimaryButton>
      </AdminCard>

      <AdminCard className="p-4">
        <h4 className="text-sm font-bold text-slate-900 mb-2">İşlem Geçmişi (Timeline)</h4>
        <div className="space-y-2 max-h-52 overflow-y-auto">
          {threadTimeline.length ? threadTimeline.map((event, idx) => (
            <div key={`${event.event_type}-${event.created_at}-${idx}`} className="text-xs rounded-lg border border-slate-200 bg-slate-50 p-2">
              <p className="font-bold text-slate-700">{event.event_type}</p>
              <p className="text-slate-500 mt-0.5">{formatTime(event.created_at)}</p>
              {!!event.meta && <p className="text-slate-600 mt-1 break-words">{JSON.stringify(event.meta)}</p>}
            </div>
          )) : <p className="text-xs text-slate-400">Henüz kayıtlı olay yok.</p>}
        </div>
      </AdminCard>
    </div>
  );
}
