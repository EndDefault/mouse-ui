import { COMPONENT_TYPES } from "../model/componentTypes.js";
import { ButtonCanvasItem } from "./renderers/ButtonCanvasItem.jsx";

export function CanvasItemFrame({ component, isSelected, onSelect }) {
  const className = isSelected
    ? "canvas-item-frame is-selected"
    : "canvas-item-frame";

  function handleClick(event) {
    event.stopPropagation();
    onSelect(component.id);
  }

  return (
    <div
      className={className}
      style={{
        left: component.x,
        top: component.y,
        width: component.width,
        height: component.height
      }}
      onClick={handleClick}
    >
      {component.type === COMPONENT_TYPES.BUTTON ? (
        <ButtonCanvasItem component={component} />
      ) : null}
    </div>
  );
}
