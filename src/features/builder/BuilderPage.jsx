import { useState } from "react";
import { AppLayout } from "../../app/AppLayout.jsx";
import { Canvas } from "./canvas/Canvas.jsx";
import { CodePanel } from "./code/CodePanel.jsx";
import { generateHtml } from "./codegen/generateHtml.js";
import { InspectorPanel } from "./inspector/InspectorPanel.jsx";
import { useBuilderState } from "./state/useBuilderState.js";
import { Toolbar } from "./toolbar/Toolbar.jsx";
import "./builder.css";

export function BuilderPage() {
  const [animationPreview, setAnimationPreview] = useState({
    activeStateIds: [],
    enterPreviewId: null,
    enterPreviewKey: 0
  });
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
            <span>v1.2.0</span>
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
      }
      sidePanel={
        <div className="builder-side-panel">
          <InspectorPanel
            component={selectedComponent}
            animationPreview={animationPreview}
            onChangeComponent={changeComponent}
            onPlayEnterPreview={playEnterPreview}
            onToggleStatePreview={toggleStatePreview}
          />
          <CodePanel
            code={htmlCode}
            componentCount={components.length}
            selectedIds={selectedIds}
          />
        </div>
      }
    />
  );
}
