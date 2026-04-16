export function AdminToggle({ label, checked, onChange, className = '' }) {
  return (
    <label className={`flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`.trim()}>
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="admin-toggle" />
    </label>
  );
}
