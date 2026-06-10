import {
  getBackgroundCss,
  getCanvasVisualStyle
} from "../../model/styleValues.js";

export function ImageCanvasItem({ component }) {
  if (component.props.src) {
    return (
      <img
        alt={component.props.alt}
        className="canvas-image-item"
        src={component.props.src}
        style={{
          ...getCanvasVisualStyle(component.style),
          "--image-radius": `${component.style.borderRadius}px`
        }}
      />
    );
  }

  return (
    <div
      className="canvas-image-placeholder"
      style={{
        ...getCanvasVisualStyle(component.style),
        "--image-bg": getBackgroundCss(component.style),
        "--image-radius": `${component.style.borderRadius}px`
      }}
    >
      이미지
    </div>
  );
}
