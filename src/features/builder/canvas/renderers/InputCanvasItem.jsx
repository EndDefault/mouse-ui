import {
  getBackgroundCss,
  getBorderCss,
  getShadowCss
} from "../../model/styleValues.js";

export function InputCanvasItem({ component }) {
  return (
    <label
      className="canvas-input-item"
      style={{
        opacity: component.style.opacity,
        "--input-bg": getBackgroundCss(component.style),
        "--input-border": getBorderCss(component.style),
        "--input-color": component.style.color,
        "--input-radius": `${component.style.borderRadius}px`,
        "--input-shadow": getShadowCss(component.style)
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
