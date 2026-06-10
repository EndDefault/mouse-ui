import { CanvasEmptyState } from "./CanvasEmptyState.jsx";
import { CanvasItemFrame } from "./CanvasItemFrame.jsx";
import { useCanvasPanZoom } from "./interactions/useCanvasPanZoom.js";

export function CanvasViewport({
  canvas,
  components,
  selectedId,
  onSelectComponent,
  onChangeComponent,
  onChangeViewport
}) {
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

    onSelectComponent(null);
  }

  return (
    <div ref={stageRef} className={shellClassName} {...panZoomHandlers}>
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
          {components.map((component) => (
            <CanvasItemFrame
              key={component.id}
              component={component}
              isSelected={component.id === selectedId}
              scale={canvas.viewport.zoom}
              onSelect={onSelectComponent}
              onChange={onChangeComponent}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
