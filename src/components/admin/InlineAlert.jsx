export function InlineAlert({ tone = 'info', className = '', children }) {
  return <p data-tone={tone} className={`admin-inline-alert ${className}`.trim()}>{children}</p>;
}
