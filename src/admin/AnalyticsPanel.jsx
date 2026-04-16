import { AdminCard } from '../components/admin/AdminCard';

export function AnalyticsPanel({
  statsRange,
  setStatsRange,
  exportStatsCsv,
  statsDateRange,
  setStatsDateRange,
  adminStats,
  previousAdminStats,
  pctChange,
  statsAlerts,
  engagementInsights,
}) {
  return (
    <div className="p-6 md:p-8 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Stats Dashboard ({statsRange === 'daily' ? 'Günlük' : statsRange === 'weekly' ? 'Haftalık' : 'Aylık'})</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setStatsRange('daily')} className={`px-4 py-2 rounded-xl font-bold ${statsRange === 'daily' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Günlük</button>
        <button onClick={() => setStatsRange('weekly')} className={`px-4 py-2 rounded-xl font-bold ${statsRange === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Haftalık</button>
        <button onClick={() => setStatsRange('monthly')} className={`px-4 py-2 rounded-xl font-bold ${statsRange === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Aylık</button>
        <button onClick={exportStatsCsv} className="px-4 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white">CSV Export</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        <label className="text-xs font-bold text-slate-500">Tarih Başlangıç
          <input type="date" value={statsDateRange.from} onChange={(e) => setStatsDateRange((p) => ({ ...p, from: e.target.value }))} className="mt-1 w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm" />
        </label>
        <label className="text-xs font-bold text-slate-500">Tarih Bitiş
          <input type="date" value={statsDateRange.to} onChange={(e) => setStatsDateRange((p) => ({ ...p, to: e.target.value }))} className="mt-1 w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm" />
        </label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <AdminCard className="p-4"><p className="text-sm text-slate-500 font-semibold mb-1">Toplam Mesaj</p><p className="text-3xl font-black text-slate-900">{adminStats.totalMessagesToday}</p><p className={`text-xs font-bold ${pctChange(adminStats.totalMessagesToday, previousAdminStats.totalMessagesToday) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{pctChange(adminStats.totalMessagesToday, previousAdminStats.totalMessagesToday).toFixed(1)}%</p></AdminCard>
        <AdminCard className="p-4"><p className="text-sm text-slate-500 font-semibold mb-1">Üye Mesajı</p><p className="text-3xl font-black text-slate-900">{adminStats.memberMessagesToday}</p><p className={`text-xs font-bold ${pctChange(adminStats.memberMessagesToday, previousAdminStats.memberMessagesToday) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{pctChange(adminStats.memberMessagesToday, previousAdminStats.memberMessagesToday).toFixed(1)}%</p></AdminCard>
        <AdminCard className="p-4"><p className="text-sm text-slate-500 font-semibold mb-1">Admin Cevabı</p><p className="text-3xl font-black text-slate-900">{adminStats.adminRepliesToday}</p><p className={`text-xs font-bold ${pctChange(adminStats.adminRepliesToday, previousAdminStats.adminRepliesToday) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{pctChange(adminStats.adminRepliesToday, previousAdminStats.adminRepliesToday).toFixed(1)}%</p></AdminCard>
        <AdminCard className="p-4"><p className="text-sm text-slate-500 font-semibold mb-1">Cevaplanan Thread</p><p className="text-3xl font-black text-slate-900">{adminStats.respondedThreadsToday}</p><p className={`text-xs font-bold ${pctChange(adminStats.respondedThreadsToday, previousAdminStats.respondedThreadsToday) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{pctChange(adminStats.respondedThreadsToday, previousAdminStats.respondedThreadsToday).toFixed(1)}%</p></AdminCard>
        <AdminCard className="p-4"><p className="text-sm text-slate-500 font-semibold mb-1">Yeni Üye Kaydı</p><p className="text-3xl font-black text-slate-900">{adminStats.newMembersToday}</p><p className={`text-xs font-bold ${pctChange(adminStats.newMembersToday, previousAdminStats.newMembersToday) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{pctChange(adminStats.newMembersToday, previousAdminStats.newMembersToday).toFixed(1)}%</p></AdminCard>
        <AdminCard className="p-4"><p className="text-sm text-slate-500 font-semibold mb-1">Aktif Thread</p><p className="text-3xl font-black text-slate-900">{adminStats.activeThreadsToday}</p><p className={`text-xs font-bold ${pctChange(adminStats.activeThreadsToday, previousAdminStats.activeThreadsToday) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{pctChange(adminStats.activeThreadsToday, previousAdminStats.activeThreadsToday).toFixed(1)}%</p></AdminCard>
      </div>
      {!!statsAlerts.length && <div className="mb-4 p-4 rounded-2xl border border-rose-200 bg-rose-50"><h4 className="text-sm font-black text-rose-700 mb-2">Kritik Alarm</h4><ul className="text-xs text-rose-700 list-disc pl-4 space-y-1">{statsAlerts.map((alert) => <li key={alert}>{alert}</li>)}</ul></div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminCard className="p-4 bg-slate-50"><h3 className="text-xl font-bold text-slate-800 mb-2">Engagement (7 Gün)</h3><div className="flex flex-wrap gap-2">{engagementInsights.topHours.length ? engagementInsights.topHours.map((item) => <span key={item.label} className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">{item.label} ({item.count})</span>) : <span className="text-sm text-slate-400">Veri yok</span>}</div></AdminCard>
        <AdminCard className="p-4 bg-slate-50"><h3 className="text-xl font-bold text-slate-800 mb-2">İlgi gören profiller:</h3><div className="space-y-2">{engagementInsights.topProfiles.length ? engagementInsights.topProfiles.map((item) => <div key={item.name} className="flex items-center justify-between rounded-xl bg-white border border-slate-200 px-3 py-2 text-sm"><span className="font-semibold text-slate-700">{item.name}</span><span className="font-black text-indigo-700">{item.count}</span></div>) : <span className="text-sm text-slate-400">Veri yok</span>}</div></AdminCard>
      </div>
    </div>
  );
}
