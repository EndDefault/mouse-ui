export function BoxCanvasItem({ component }) {
  return (
    <div
      className="canvas-box-item"
      style={{
        "--box-bg": component.style.backgroundColor,
        "--box-radius": `${component.style.borderRadius}px`
      }}
    />
  );
}
