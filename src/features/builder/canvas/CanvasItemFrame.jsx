import { Rnd } from "react-rnd";
import { COMPONENT_TYPES } from "../model/componentTypes.js";
import { ButtonCanvasItem } from "./renderers/ButtonCanvasItem.jsx";
import { TextCanvasItem } from "./renderers/TextCanvasItem.jsx";

const RESIZE_HANDLE_STYLES = {
  top: { height: 8, top: -4 },
  right: { width: 8, right: -4 },
  bottom: { height: 8, bottom: -4 },
  left: { width: 8, left: -4 },
  topRight: { width: 10, height: 10, top: -5, right: -5 },
  bottomRight: { width: 10, height: 10, bottom: -5, right: -5 },
  bottomLeft: { width: 10, height: 10, bottom: -5, left: -5 },
  topLeft: { width: 10, height: 10, top: -5, left: -5 }
};

export function CanvasItemFrame({ component, isSelected, onSelect, onChange }) {
  const className = isSelected
    ? "canvas-item-frame is-selected"
    : "canvas-item-frame";

  function handleClick(event) {
    event.stopPropagation();
    onSelect(component.id);
  }

  function handleDragStop(_event, data) {
    onChange(component.id, {
      x: Math.round(data.x),
      y: Math.round(data.y)
    });
  }

  function handleResizeStop(_event, _direction, element, _delta, position) {
    onChange(component.id, {
      x: Math.round(position.x),
      y: Math.round(position.y),
      width: Math.round(element.offsetWidth),
      height: Math.round(element.offsetHeight)
    });
  }

  return (
    <Rnd
      bounds="parent"
      className={className}
      minWidth={64}
      minHeight={32}
      position={{ x: component.x, y: component.y }}
      resizeHandleStyles={isSelected ? RESIZE_HANDLE_STYLES : undefined}
      size={{ width: component.width, height: component.height }}
      onClick={handleClick}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
    >
      {component.type === COMPONENT_TYPES.BUTTON ? (
        <ButtonCanvasItem component={component} />
      ) : null}
      {component.type === COMPONENT_TYPES.TEXT ? (
        <TextCanvasItem component={component} />
      ) : null}
    </Rnd>
  );
}
