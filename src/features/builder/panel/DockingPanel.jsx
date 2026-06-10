import { Rnd } from "react-rnd";
import { CodePanel } from "../code/CodePanel.jsx";
import { InspectorPanel } from "../inspector/InspectorPanel.jsx";
import { BUILDER_PANEL_TABS } from "../workspace/workspaceSettings.js";

const PANEL_TABS = [
  { id: BUILDER_PANEL_TABS.ADJUST, label: "조정" },
  { id: BUILDER_PANEL_TABS.STYLE, label: "꾸미기" },
  { id: BUILDER_PANEL_TABS.ANIMATION, label: "애니메이션" },
  { id: BUILDER_PANEL_TABS.HTML, label: "HTML" }
];

const PANEL_MIN_WIDTH = 300;
const PANEL_MIN_HEIGHT = 360;

export function DockingPanel({
  panel,
  component,
  code,
  componentCount,
  selectedIds,
  animationPreview,
  onChangePanel,
  onResetPanel,
  onChangeComponent,
  onPlayEnterPreview,
  onToggleStatePreview
}) {
  const content = (
    <PanelShell
      panel={panel}
      component={component}
      code={code}
      componentCount={componentCount}
      selectedIds={selectedIds}
      animationPreview={animationPreview}
      onChangePanel={onChangePanel}
      onResetPanel={onResetPanel}
      onChangeComponent={onChangeComponent}
      onPlayEnterPreview={onPlayEnterPreview}
      onToggleStatePreview={onToggleStatePreview}
    />
  );

  if (panel.isDocked) {
    return (
      <div
        className="docking-panel is-docked"
        style={{ width: panel.width }}
      >
        {content}
      </div>
    );
  }

  return (
    <Rnd
      bounds="parent"
      className="docking-panel-rnd"
      dragHandleClassName="docking-panel-drag-handle"
      minHeight={PANEL_MIN_HEIGHT}
      minWidth={PANEL_MIN_WIDTH}
      position={{ x: panel.x, y: panel.y }}
      size={{ width: panel.width, height: panel.height }}
      onDragStop={(_event, data) =>
        onChangePanel({ x: Math.round(data.x), y: Math.round(data.y) })
      }
      onResizeStop={(_event, _direction, element, _delta, position) =>
        onChangePanel({
          x: Math.round(position.x),
          y: Math.round(position.y),
          width: Math.round(element.offsetWidth),
          height: Math.round(element.offsetHeight)
        })
      }
    >
      <div className="docking-panel is-floating">{content}</div>
    </Rnd>
  );
}

function PanelShell({
  panel,
  component,
  code,
  componentCount,
  selectedIds,
  animationPreview,
  onChangePanel,
  onResetPanel,
  onChangeComponent,
  onPlayEnterPreview,
  onToggleStatePreview
}) {
  return (
    <>
      <div className="docking-panel-header">
        <div className="docking-panel-title docking-panel-drag-handle">
          <strong>작업 패널</strong>
          <span>{panel.isDocked ? "오른쪽 고정" : "자유 이동"}</span>
        </div>
        <div className="docking-panel-actions">
          <button
            type="button"
            onClick={() => onChangePanel({ isDocked: !panel.isDocked })}
          >
            {panel.isDocked ? "떼기" : "붙이기"}
          </button>
          <button type="button" onClick={onResetPanel}>
            초기화
          </button>
        </div>
      </div>

      <div className="docking-panel-tabs" role="tablist" aria-label="작업 패널">
        {PANEL_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={panel.activeTab === tab.id ? "is-active" : ""}
            role="tab"
            aria-selected={panel.activeTab === tab.id}
            onClick={() => onChangePanel({ activeTab: tab.id })}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="docking-panel-body">
        {panel.activeTab === BUILDER_PANEL_TABS.HTML ? (
          <CodePanel
            code={code}
            componentCount={componentCount}
            selectedIds={selectedIds}
          />
        ) : (
          <InspectorPanel
            component={component}
            panelTab={panel.activeTab}
            animationPreview={animationPreview}
            onChangeComponent={onChangeComponent}
            onPlayEnterPreview={onPlayEnterPreview}
            onToggleStatePreview={onToggleStatePreview}
          />
        )}
      </div>
    </>
  );
}
