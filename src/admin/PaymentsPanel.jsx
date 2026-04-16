import { usePaymentsState } from '../hooks/admin/usePaymentsState';
import { AdminCard } from '../components/admin/AdminCard';
import { SectionHeader } from '../components/admin/SectionHeader';

export function PaymentsPanel({ paymentSettings, defaultCheckoutEndpoint, onSave }) {
  const { draft, setDraft, isDirty } = usePaymentsState(paymentSettings);

  return (
    <div className="p-6 md:p-8 overflow-y-auto">
      <AdminCard className="p-6 max-w-2xl bg-slate-50">
        <SectionHeader
          title="Ödeme API Entegrasyonu"
          subtitle="Bu alandaki URL sadece uygulamanın checkout başlatırken çağırdığı endpointtir."
          className="mb-2"
        />
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-6">Stripe webhook callback adresi buradan yönetilmez. Stripe Dashboard → Developers → Webhooks ekranındaki endpoint ayrıca <code className="px-1 py-0.5 rounded bg-amber-100 text-amber-900">/api/webhook</code> olmalıdır.</p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Provider (örn: stripe, paytr)</label>
            <input placeholder="Provider girin" value={draft.provider} onChange={(e) => setDraft((prev) => ({ ...prev, provider: e.target.value }))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Checkout Session Endpoint URL (Client → API)</label>
            <input value={draft.webhook_url} onChange={(e) => setDraft((prev) => ({ ...prev, webhook_url: e.target.value }))} placeholder={defaultCheckoutEndpoint} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
            <p className="text-xs text-slate-500 font-medium mt-2">Stripe callback (Stripe → API) adresi: <code className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">/api/webhook</code></p>
          </div>

          <label className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl cursor-pointer shadow-sm mt-4 hover:border-emerald-300 transition-colors">
            <span className="font-bold text-slate-700">Entegrasyon Aktif</span>
            <input type="checkbox" checked={draft.is_active} onChange={(e) => setDraft((prev) => ({ ...prev, is_active: e.target.checked }))} className="w-5 h-5 accent-emerald-500 cursor-pointer" />
          </label>

          <button onClick={() => onSave(draft)} disabled={!isDirty} className="w-full bg-indigo-600 disabled:bg-slate-400 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors mt-2">
            Ödeme Ayarlarını Kaydet
          </button>
        </div>
      </AdminCard>
    </div>
  );
}
