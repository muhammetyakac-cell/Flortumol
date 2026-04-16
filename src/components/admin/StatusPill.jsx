const toneMap = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  danger: 'bg-rose-100 text-rose-700 border-rose-200',
  info: 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

export function StatusPill({ children, tone = 'neutral', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${toneMap[tone] || toneMap.neutral} ${className}`}>
      {children}
    </span>
  );
}
