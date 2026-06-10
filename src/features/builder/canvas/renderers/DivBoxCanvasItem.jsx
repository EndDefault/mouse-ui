import {
  getBackgroundCss,
  getCanvasVisualStyle
} from "../../model/styleValues.js";

export function DivBoxCanvasItem({ component }) {
  return (
    <div
      className="canvas-div-box-item"
      style={{
        ...getCanvasVisualStyle(component.style),
        "--div-box-bg": getBackgroundCss(component.style),
        "--div-box-radius": `${component.style.borderRadius}px`
      }}
    />
  );
}
