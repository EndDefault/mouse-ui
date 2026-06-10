import { Rnd } from "react-rnd";
import { COMPONENT_TYPES } from "../model/componentTypes.js";
import { BoxCanvasItem } from "./renderers/BoxCanvasItem.jsx";
import { ButtonCanvasItem } from "./renderers/ButtonCanvasItem.jsx";
import { ContainerCanvasItem } from "./renderers/ContainerCanvasItem.jsx";
import { ImageCanvasItem } from "./renderers/ImageCanvasItem.jsx";
import { InputCanvasItem } from "./renderers/InputCanvasItem.jsx";
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

export function CanvasItemFrame({
  component,
  childrenByParent = new Map(),
  isSelected,
  scale = 1,
  selectedId,
  onOpenContextMenu,
  onSelect,
  onChange
}) {
  const isContainer = component.type === COMPONENT_TYPES.CONTAINER;
  const childComponents = childrenByParent.get(component.id) ?? [];
  const className = [
    "canvas-item-frame",
    isContainer ? "is-container" : "",
    isSelected ? "is-selected" : ""
  ]
    .filter(Boolean)
    .join(" ");

  function handleClick(event) {
    event.stopPropagation();
    onSelect(component.id);
  }

  function handleContextMenu(event) {
    if (!isContainer) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    event.preventDefault();
    event.stopPropagation();
    onSelect(component.id);
    onOpenContextMenu({
      componentId: component.id,
      clientX: event.clientX,
      clientY: event.clientY,
      localX: (event.clientX - rect.left) / scale,
      localY: (event.clientY - rect.top) / scale
    });
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
      scale={scale}
      size={{ width: component.width, height: component.height }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
    >
      {component.type === COMPONENT_TYPES.BUTTON ? (
        <ButtonCanvasItem component={component} />
      ) : null}
      {component.type === COMPONENT_TYPES.TEXT ? (
        <TextCanvasItem component={component} />
      ) : null}
      {component.type === COMPONENT_TYPES.INPUT ? (
        <InputCanvasItem component={component} />
      ) : null}
      {component.type === COMPONENT_TYPES.BOX ? (
        <BoxCanvasItem component={component} />
      ) : null}
      {component.type === COMPONENT_TYPES.CONTAINER ? (
        <>
          <ContainerCanvasItem component={component} />
          {childComponents.map((childComponent) => (
            <CanvasItemFrame
              key={childComponent.id}
              component={childComponent}
              childrenByParent={childrenByParent}
              isSelected={childComponent.id === selectedId}
              scale={scale}
              selectedId={selectedId}
              onOpenContextMenu={onOpenContextMenu}
              onSelect={onSelect}
              onChange={onChange}
            />
          ))}
        </>
      ) : null}
      {component.type === COMPONENT_TYPES.IMAGE ? (
        <ImageCanvasItem component={component} />
      ) : null}
    </Rnd>
  );
}
