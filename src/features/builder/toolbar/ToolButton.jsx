export function ToolButton({ icon, label, title, onClick }) {
  return (
    <button className="tool-button" type="button" title={title} onClick={onClick}>
      <span className="tool-button-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="tool-button-label">{label}</span>
    </button>
  );
}
