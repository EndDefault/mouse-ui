import { useEffect, useState } from "react";
import { AppLayout } from "../../app/AppLayout.jsx";
import { Canvas } from "./canvas/Canvas.jsx";
import { CopyCodeButton } from "./code/CopyCodeButton.jsx";
import { generateHtml } from "./codegen/generateHtml.js";
import { DockingPanel } from "./panel/DockingPanel.jsx";
import { useBuilderState } from "./state/useBuilderState.js";
import { CanvasSizeControl } from "./toolbar/CanvasSizeControl.jsx";
import { ProjectJsonControls } from "./toolbar/ProjectJsonControls.jsx";
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
    styleDefaults,
    addComponent,
    selectComponent,
    selectComponents,
    changeComponent,
    moveComponents,
    copyComponents,
    pasteComponents,
    hasClipboard,
    deleteComponent,
    setComponentLocked,
    changeStyleDefaultColor,
    applyStyleDefaultToSelected,
    resetStyleDefaults,
    changeCanvasSize,
    changeCanvasViewport,
    importProject
  } = useBuilderState();
  const htmlCode = generateHtml(project);
  const selectedComponent =
    components.find((component) => component.id === selectedId) ?? null;

  useEffect(() => {
    function handleKeyDown(event) {
      if (isEditableTarget(event.target) || (!event.ctrlKey && !event.metaKey)) {
        return;
      }

      if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        copyComponents();
      }

      if (event.key.toLowerCase() === "v") {
        event.preventDefault();
        pasteComponents();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copyComponents, pasteComponents]);

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
            <span>v1.4.0</span>
          </div>
          <div className="builder-topbar-controls">
            <CanvasSizeControl
              canvas={canvas}
              onChangeCanvasSize={changeCanvasSize}
            />
            <ProjectJsonControls
              project={project}
              onImportProject={importProject}
            />
            <CopyCodeButton code={htmlCode} />
          </div>
        </div>
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
            onCopyComponents={copyComponents}
            onPasteComponents={pasteComponents}
            hasClipboard={hasClipboard}
            onSetComponentLocked={setComponentLocked}
            onDeleteComponent={deleteComponent}
            onChangeViewport={changeCanvasViewport}
          />
          <DockingPanel
            panel={settings.panel}
            component={selectedComponent}
            components={components}
            styleDefaults={styleDefaults}
            code={htmlCode}
            componentCount={components.length}
            selectedIds={selectedIds}
            animationPreview={animationPreview}
            onChangePanel={changePanel}
            onResetPanel={resetPanel}
            onChangeComponent={changeComponent}
            onSetComponentLocked={setComponentLocked}
            onChangeStyleDefaultColor={changeStyleDefaultColor}
            onApplyStyleDefaultToSelected={applyStyleDefaultToSelected}
            onResetStyleDefaults={resetStyleDefaults}
            onPlayEnterPreview={playEnterPreview}
            onToggleStatePreview={toggleStatePreview}
          />
        </div>
      }
    />
  );
}

function isEditableTarget(target) {
  return ["INPUT", "SELECT", "TEXTAREA"].includes(target?.tagName);
}
