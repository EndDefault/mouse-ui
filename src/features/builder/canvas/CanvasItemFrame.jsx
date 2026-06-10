import { useRef } from "react";
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
  selectedIds = [],
  onOpenContextMenu,
  onSelect,
  onChange,
  onMoveComponents
}) {
  const dragPositionRef = useRef(null);
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
    const rect = event.currentTarget.getBoundingClientRect();

    event.preventDefault();
    event.stopPropagation();
    onSelect(component.id);
    onOpenContextMenu({
      componentId: component.id,
      canAddChildren: isContainer,
      clientX: event.clientX,
      clientY: event.clientY,
      localX: (event.clientX - rect.left) / scale,
      localY: (event.clientY - rect.top) / scale
    });
  }

  function handleDragStart(_event, data) {
    if (!isSelected) {
      onSelect(component.id);
    }

    dragPositionRef.current = {
      x: Math.round(data.x),
      y: Math.round(data.y)
    };
  }

  function handleDrag(_event, data) {
    if (!isSelected || selectedIds.length < 2) {
      return;
    }

    const previousPosition = dragPositionRef.current;

    if (!previousPosition) {
      return;
    }

    const nextPosition = {
      x: Math.round(data.x),
      y: Math.round(data.y)
    };
    const delta = {
      x: nextPosition.x - previousPosition.x,
      y: nextPosition.y - previousPosition.y
    };

    if (delta.x === 0 && delta.y === 0) {
      return;
    }

    dragPositionRef.current = nextPosition;
    onMoveComponents(selectedIds, delta);
  }

  function handleDragStop(_event, data) {
    dragPositionRef.current = null;

    if (isSelected && selectedIds.length > 1) {
      return;
    }

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
      onDrag={handleDrag}
      onDragStart={handleDragStart}
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
              isSelected={selectedIds.includes(childComponent.id)}
              scale={scale}
              selectedId={selectedId}
              selectedIds={selectedIds}
              onOpenContextMenu={onOpenContextMenu}
              onSelect={onSelect}
              onChange={onChange}
              onMoveComponents={onMoveComponents}
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
