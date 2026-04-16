import { usePaymentsState } from '../hooks/admin/usePaymentsState';
import { AdminCard } from '../components/admin/AdminCard';
import { SectionHeader } from '../components/admin/SectionHeader';
import { AdminInput } from '../components/admin/AdminInput';
import { AdminToggle } from '../components/admin/AdminToggle';
import { AdminPrimaryButton } from '../components/admin/AdminPrimaryButton';
import { InlineAlert } from '../components/admin/InlineAlert';

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
        <InlineAlert tone="warning" className="mb-6">Stripe webhook callback adresi buradan yönetilmez. Stripe Dashboard → Developers → Webhooks ekranındaki endpoint ayrıca <code className="px-1 py-0.5 rounded bg-amber-100 text-amber-900">/api/webhook</code> olmalıdır.</InlineAlert>

        <div className="space-y-5">
          <AdminInput label="Provider (örn: stripe, paytr)" placeholder="Provider girin" value={draft.provider} onChange={(e) => setDraft((prev) => ({ ...prev, provider: e.target.value }))} />

          <div>
            <AdminInput label="Checkout Session Endpoint URL (Client → API)" value={draft.webhook_url} onChange={(e) => setDraft((prev) => ({ ...prev, webhook_url: e.target.value }))} placeholder={defaultCheckoutEndpoint} />
            <p className="text-xs text-slate-500 font-medium mt-2">Stripe callback (Stripe → API) adresi: <code className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">/api/webhook</code></p>
          </div>

          <AdminToggle label="Entegrasyon Aktif" checked={draft.is_active} onChange={(e) => setDraft((prev) => ({ ...prev, is_active: e.target.checked }))} />

          <AdminPrimaryButton onClick={() => onSave(draft)} disabled={!isDirty} className="w-full py-3.5 mt-2">
            Ödeme Ayarlarını Kaydet
          </AdminPrimaryButton>
        </div>
      </AdminCard>
    </div>
  );
}
