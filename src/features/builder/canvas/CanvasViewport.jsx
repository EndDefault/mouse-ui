import { useMemo } from "react";
import { CanvasContextMenu } from "./CanvasContextMenu.jsx";
import { CanvasEmptyState } from "./CanvasEmptyState.jsx";
import { CanvasItemFrame } from "./CanvasItemFrame.jsx";
import { renderAnimations } from "../codegen/renderAnimations.js";
import { useCanvasContextMenu } from "./interactions/useCanvasContextMenu.js";
import { useCanvasLassoSelection } from "./interactions/useCanvasLassoSelection.js";
import { useCanvasPanZoom } from "./interactions/useCanvasPanZoom.js";

export function CanvasViewport({
  canvas,
  components,
  selectedId,
  selectedIds,
  animationPreview,
  onAddComponent,
  onSelectComponent,
  onSelectComponents,
  onChangeComponent,
  onMoveComponents,
  onCopyComponents,
  onPasteComponents,
  hasClipboard,
  onSetComponentLocked,
  onDeleteComponent,
  onChangeViewport
}) {
  const childrenByParent = useMemo(
    () => groupComponentsByParent(components),
    [components]
  );
  const topLevelComponents = childrenByParent.get(null) ?? [];
  const animationCss = useMemo(() => renderAnimations(components), [components]);
  const {
    menu,
    openMenu,
    closeMenu,
    addComponentToContainer,
    copyComponentFromMenu,
    pasteComponentFromMenu,
    toggleLockFromMenu,
    deleteComponentFromMenu
  } = useCanvasContextMenu({
    selectedIds,
    onAddComponent,
    onCopyComponents,
    onPasteComponents,
    onSetComponentLocked,
    onDeleteComponent
  });
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
  const {
    selectionBox,
    selectionHandlers,
    shouldSuppressSelectionClick
  } = useCanvasLassoSelection({
    canvas,
    components,
    isSpacePressed,
    stageRef,
    onSelectComponents
  });
  const shellClassName = [
    "canvas-pan-shell",
    isSpacePressed ? "is-space-ready" : "",
    isPanning ? "is-panning" : ""
  ]
    .filter(Boolean)
    .join(" ");

  function handleViewportClick() {
    if (shouldSuppressClick() || shouldSuppressSelectionClick()) {
      return;
    }

    closeMenu();
    onSelectComponent(null);
  }

  function handleViewportContextMenu(event) {
    if (event.target !== event.currentTarget) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    event.preventDefault();
    closeMenu();
    onSelectComponent(null);
    openMenu({
      componentId: null,
      canAddChildren: true,
      clientX: event.clientX,
      clientY: event.clientY,
      localX: (event.clientX - rect.left) / canvas.viewport.zoom,
      localY: (event.clientY - rect.top) / canvas.viewport.zoom
    });
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
          onContextMenu={handleViewportContextMenu}
          {...selectionHandlers}
        >
          {animationCss ? <style>{animationCss}</style> : null}
          {components.length === 0 ? <CanvasEmptyState /> : null}
          {topLevelComponents.map((component) => (
            <CanvasItemFrame
              key={component.id}
              component={component}
              childrenByParent={childrenByParent}
              isSelected={selectedIds.includes(component.id)}
              scale={canvas.viewport.zoom}
              selectedId={selectedId}
              selectedIds={selectedIds}
              animationPreview={animationPreview}
              onOpenContextMenu={openMenu}
              onSelect={onSelectComponent}
              onChange={onChangeComponent}
              onMoveComponents={onMoveComponents}
            />
          ))}
          {selectionBox ? (
            <div
              className="canvas-selection-box"
              style={{
                left: selectionBox.x,
                top: selectionBox.y,
                width: selectionBox.width,
                height: selectionBox.height
              }}
            />
          ) : null}
        </div>
      </div>
      <CanvasContextMenu
        menu={menu}
        canPaste={hasClipboard}
        onAdd={addComponentToContainer}
        onCopy={copyComponentFromMenu}
        onPaste={pasteComponentFromMenu}
        onToggleLock={toggleLockFromMenu}
        onDelete={deleteComponentFromMenu}
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
