import { useState } from "react";
import { AppLayout } from "../../app/AppLayout.jsx";
import { Canvas } from "./canvas/Canvas.jsx";
import { generateHtml } from "./codegen/generateHtml.js";
import { DockingPanel } from "./panel/DockingPanel.jsx";
import { useBuilderState } from "./state/useBuilderState.js";
import { Toolbar } from "./toolbar/Toolbar.jsx";
import { useWorkspaceSettings } from "./workspace/useWorkspaceSettings.js";
import "./builder.css";

export function BuilderPage() {
  const [animationPreview, setAnimationPreview] = useState({
    activeStateIds: [],
    enterPreviewId: null,
    enterPreviewKey: 0
  });
  const { settings, changePanel, resetPanel } = useWorkspaceSettings();
  const {
    project,
    canvas,
    components,
    selectedId,
    selectedIds,
    addComponent,
    selectComponent,
    selectComponents,
    changeComponent,
    moveComponents,
    deleteComponent,
    changeCanvasSize,
    changeCanvasViewport,
    importProject
  } = useBuilderState();
  const htmlCode = generateHtml(project);
  const selectedComponent =
    components.find((component) => component.id === selectedId) ?? null;

  function playEnterPreview(componentId) {
    setAnimationPreview((currentPreview) => ({
      ...currentPreview,
      enterPreviewId: componentId,
      enterPreviewKey: currentPreview.enterPreviewKey + 1
    }));
  }

  function toggleStatePreview(componentId) {
    setAnimationPreview((currentPreview) => {
      const isActive = currentPreview.activeStateIds.includes(componentId);

      return {
        ...currentPreview,
        activeStateIds: isActive
          ? currentPreview.activeStateIds.filter((id) => id !== componentId)
          : [...currentPreview.activeStateIds, componentId]
      };
    });
  }

  return (
    <AppLayout
      topBar={
        <div className="builder-topbar">
          <div>
            <h1>mouse-ui</h1>
            <span>v1.3.2</span>
          </div>
          <strong>화면 설계 도구</strong>
        </div>
      }
      toolbar={
        <Toolbar
          project={project}
          canvas={canvas}
          onAddComponent={addComponent}
          onChangeCanvasSize={changeCanvasSize}
          onImportProject={importProject}
        />
      }
      canvas={
        <div className="builder-canvas-area">
          <Canvas
            canvas={canvas}
            components={components}
            selectedId={selectedId}
            selectedIds={selectedIds}
            animationPreview={animationPreview}
            onAddComponent={addComponent}
            onSelectComponent={selectComponent}
            onSelectComponents={selectComponents}
            onChangeComponent={changeComponent}
            onMoveComponents={moveComponents}
            onDeleteComponent={deleteComponent}
            onChangeViewport={changeCanvasViewport}
          />
          <DockingPanel
            panel={settings.panel}
            component={selectedComponent}
            code={htmlCode}
            componentCount={components.length}
            selectedIds={selectedIds}
            animationPreview={animationPreview}
            onChangePanel={changePanel}
            onResetPanel={resetPanel}
            onChangeComponent={changeComponent}
            onPlayEnterPreview={playEnterPreview}
            onToggleStatePreview={toggleStatePreview}
          />
        </div>
      }
    />
  );
}
