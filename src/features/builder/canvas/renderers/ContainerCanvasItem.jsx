import {
  getBackgroundCss,
  getCanvasVisualStyle
} from "../../model/styleValues.js";

export function ContainerCanvasItem({ component }) {
  return (
    <div
      className="canvas-container-bg"
      style={{
        ...getCanvasVisualStyle(component.style),
        "--container-bg": getBackgroundCss(component.style),
        "--container-radius": `${component.style.borderRadius}px`
      }}
    />
  );
}
