import {
  getBackgroundCss,
  getCanvasVisualStyle
} from "../../model/styleValues.js";

export function ButtonCanvasItem({ component }) {
  return (
    <button
      className="canvas-button-item"
      style={{
        ...getCanvasVisualStyle(component.style),
        "--button-bg": getBackgroundCss(component.style),
        "--button-color": component.style.color,
        borderRadius: component.style.borderRadius
      }}
      type="button"
      tabIndex={-1}
    >
      {component.props.text}
    </button>
  );
}
