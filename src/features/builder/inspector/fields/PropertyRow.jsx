export function PropertyRow({ label, children }) {
  return (
    <label className="property-row">
      <span>{label}</span>
      {children}
    </label>
  );
}
