export function EmptyState({ message, className = '' }) {
  return <div className={`h-full flex items-center justify-center text-slate-400 font-medium ${className}`}>{message}</div>;
}
