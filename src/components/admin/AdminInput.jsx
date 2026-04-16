export function AdminInput({ as = 'input', className = '', label, ...props }) {
  const Tag = as;
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span> : null}
      <Tag className={`admin-input ${className}`.trim()} {...props} />
    </label>
  );
}
