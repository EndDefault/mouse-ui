import { getBackgroundCss } from "../../model/styleValues.js";

export function InputCanvasItem({ component }) {
  return (
    <label
      className="canvas-input-item"
      style={{
        "--input-bg": getBackgroundCss(component.style),
        "--input-color": component.style.color,
        "--input-radius": `${component.style.borderRadius}px`
      }}
    >
      <span>{component.props.label}</span>
      <input
        readOnly
        placeholder={component.props.placeholder}
        tabIndex={-1}
        type={component.props.inputType}
      />
    </label>
  );
}
