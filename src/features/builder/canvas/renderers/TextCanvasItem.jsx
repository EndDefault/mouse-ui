export function TextCanvasItem({ component }) {
  return (
    <p
      className="canvas-text-item"
      style={{
        "--text-color": component.style.color,
        "--text-font-size": `${component.style.fontSize}px`
      }}
    >
      {component.props.text}
    </p>
  );
}
