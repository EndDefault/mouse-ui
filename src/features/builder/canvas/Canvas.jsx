import { CanvasViewport } from "./CanvasViewport.jsx";

export function Canvas({
  components,
  selectedId,
  onSelectComponent,
  onChangeComponent
}) {
  return (
    <div className="builder-canvas">
      <div className="builder-canvas-header">
        <h2>캔버스</h2>
        <span>{components.length}개 요소</span>
      </div>
      <div className="canvas-stage">
        <CanvasViewport
          components={components}
          selectedId={selectedId}
          onSelectComponent={onSelectComponent}
          onChangeComponent={onChangeComponent}
        />
      </div>
    </div>
  );
}
