import { getBackgroundCss } from "../../model/styleValues.js";

export function BoxCanvasItem({ component }) {
  return (
    <div
      className="canvas-box-item"
      style={{
        "--box-bg": getBackgroundCss(component.style),
        "--box-radius": `${component.style.borderRadius}px`
      }}
    />
  );
}
