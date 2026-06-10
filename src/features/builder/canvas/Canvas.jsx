import { CanvasViewport } from "./CanvasViewport.jsx";

export function Canvas({
  canvas,
  components,
  selectedId,
  onAddComponent,
  onSelectComponent,
  onChangeComponent,
  onChangeViewport
}) {
  return (
    <div className="builder-canvas">
      <div className="builder-canvas-header">
        <h2>캔버스</h2>
        <span>
          {canvas.width} x {canvas.height} /{" "}
          {Math.round(canvas.viewport.zoom * 100)}% / {components.length}개 요소
        </span>
      </div>
      <div className="canvas-stage">
        <CanvasViewport
          canvas={canvas}
          components={components}
          selectedId={selectedId}
          onAddComponent={onAddComponent}
          onSelectComponent={onSelectComponent}
          onChangeComponent={onChangeComponent}
          onChangeViewport={onChangeViewport}
        />
      </div>
    </div>
  );
}
