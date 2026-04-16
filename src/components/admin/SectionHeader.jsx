export function SectionHeader({ title, subtitle, className = '' }) {
  return (
    <div className={className}>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      {subtitle ? <p className="text-sm text-slate-600 font-medium mt-1">{subtitle}</p> : null}
    </div>
  );
}
