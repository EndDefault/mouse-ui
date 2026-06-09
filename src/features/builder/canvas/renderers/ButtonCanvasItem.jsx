export function ButtonCanvasItem({ component }) {
  return (
    <button
      className="canvas-button-item"
      style={{
        "--button-bg": component.style.backgroundColor,
        "--button-color": component.style.color,
        borderRadius: component.style.borderRadius
      }}
      type="button"
      tabIndex={-1}
    >
      {component.text}
    </button>
  );
}
