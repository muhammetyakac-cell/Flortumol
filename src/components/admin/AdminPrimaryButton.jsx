export function AdminPrimaryButton({ className = '', ...props }) {
  return <button className={`admin-primary-button ${className}`.trim()} {...props} />;
}
