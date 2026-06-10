import { useMemo } from "react";
import { CanvasContextMenu } from "./CanvasContextMenu.jsx";
import { CanvasEmptyState } from "./CanvasEmptyState.jsx";
import { CanvasItemFrame } from "./CanvasItemFrame.jsx";
import { useCanvasContextMenu } from "./interactions/useCanvasContextMenu.js";
import { useCanvasPanZoom } from "./interactions/useCanvasPanZoom.js";

export function CanvasViewport({
  canvas,
  components,
  selectedId,
  onAddComponent,
  onSelectComponent,
  onChangeComponent,
  onChangeViewport
}) {
  const childrenByParent = useMemo(
    () => groupComponentsByParent(components),
    [components]
  );
  const topLevelComponents = childrenByParent.get(null) ?? [];
  const {
    menu,
    openMenu,
    closeMenu,
    addComponentToContainer
  } = useCanvasContextMenu({ onAddComponent });
  const {
    stageRef,
    isSpacePressed,
    isPanning,
    shouldSuppressClick,
    panZoomHandlers
  } = useCanvasPanZoom({
    viewport: canvas.viewport,
    onChangeViewport
  });
  const shellClassName = [
    "canvas-pan-shell",
    isSpacePressed ? "is-space-ready" : "",
    isPanning ? "is-panning" : ""
  ]
    .filter(Boolean)
    .join(" ");

  function handleViewportClick() {
    if (shouldSuppressClick()) {
      return;
    }

    closeMenu();
    onSelectComponent(null);
  }

  return (
    <div
      ref={stageRef}
      className={shellClassName}
      onContextMenu={(event) => event.preventDefault()}
      {...panZoomHandlers}
    >
      <div
        className="canvas-viewport-transform"
        style={{
          transform: `translate(${canvas.viewport.panX}px, ${canvas.viewport.panY}px) scale(${canvas.viewport.zoom})`
        }}
      >
        <div
          className="canvas-viewport"
          style={{
            width: canvas.width,
            height: canvas.height
          }}
          onClick={handleViewportClick}
        >
          {components.length === 0 ? <CanvasEmptyState /> : null}
          {topLevelComponents.map((component) => (
            <CanvasItemFrame
              key={component.id}
              component={component}
              childrenByParent={childrenByParent}
              isSelected={component.id === selectedId}
              scale={canvas.viewport.zoom}
              selectedId={selectedId}
              onOpenContextMenu={openMenu}
              onSelect={onSelectComponent}
              onChange={onChangeComponent}
            />
          ))}
        </div>
      </div>
      <CanvasContextMenu
        menu={menu}
        onAdd={addComponentToContainer}
        onClose={closeMenu}
      />
    </div>
  );
}

function groupComponentsByParent(components) {
  const componentIds = new Set(components.map((component) => component.id));
  const groups = new Map([[null, []]]);

  components.forEach((component) => {
    const parentId =
      component.parentId && componentIds.has(component.parentId)
        ? component.parentId
        : null;
    const group = groups.get(parentId) ?? [];

    group.push(component);
    groups.set(parentId, group);
  });

  return groups;
}
