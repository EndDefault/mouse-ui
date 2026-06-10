import { getCanvasVisualStyle } from "../../model/styleValues.js";

export function TextCanvasItem({ component }) {
  return (
    <p
      className="canvas-text-item"
      style={{
        ...getCanvasVisualStyle(component.style),
        "--text-color": component.style.color,
        "--text-font-size": `${component.style.fontSize}px`,
        borderRadius: component.style.borderRadius
      }}
    >
      {component.props.text}
    </p>
  );
}
