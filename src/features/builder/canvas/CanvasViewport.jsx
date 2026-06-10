import { CanvasEmptyState } from "./CanvasEmptyState.jsx";
import { CanvasItemFrame } from "./CanvasItemFrame.jsx";

export function CanvasViewport({
  canvas,
  components,
  selectedId,
  onSelectComponent,
  onChangeComponent
}) {
  return (
    <div
      className="canvas-viewport"
      style={{
        width: canvas.width,
        height: canvas.height
      }}
      onClick={() => onSelectComponent(null)}
    >
      {components.length === 0 ? <CanvasEmptyState /> : null}
      {components.map((component) => (
        <CanvasItemFrame
          key={component.id}
          component={component}
          isSelected={component.id === selectedId}
          onSelect={onSelectComponent}
          onChange={onChangeComponent}
        />
      ))}
    </div>
  );
}
