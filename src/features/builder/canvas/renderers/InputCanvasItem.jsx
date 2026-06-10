export function InputCanvasItem({ component }) {
  return (
    <label
      className="canvas-input-item"
      style={{
        "--input-bg": component.style.backgroundColor,
        "--input-color": component.style.color,
        "--input-radius": `${component.style.borderRadius}px`
      }}
    >
      <span>{component.label}</span>
      <input
        readOnly
        placeholder={component.placeholder}
        tabIndex={-1}
        type={component.inputType}
      />
    </label>
  );
}
