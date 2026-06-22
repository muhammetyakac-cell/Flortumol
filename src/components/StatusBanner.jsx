export default function StatusBanner({ status, onClose }) {
  if (!status) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-sm w-full bg-surface-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3">
      <span className="text-xl">🔔</span>
      <p className="text-sm font-medium leading-tight pt-0.5">{status}</p>
      <button onClick={onClose} className="ml-auto text-slate-500 hover:text-white">✕</button>
    </div>
  );
}
