import { AppLayout } from "../../app/AppLayout.jsx";
import { Canvas } from "./canvas/Canvas.jsx";
import { CodePanel } from "./code/CodePanel.jsx";
import { generateHtml } from "./codegen/generateHtml.js";
import { InspectorPanel } from "./inspector/InspectorPanel.jsx";
import { useBuilderState } from "./state/useBuilderState.js";
import { Toolbar } from "./toolbar/Toolbar.jsx";
import "./builder.css";

export function BuilderPage() {
  const {
    project,
    canvas,
    components,
    selectedId,
    addComponent,
    selectComponent,
    changeComponent,
    changeCanvasSize,
    changeCanvasViewport,
    importProject
  } = useBuilderState();
  const htmlCode = generateHtml(project);
  const selectedComponent =
    components.find((component) => component.id === selectedId) ?? null;

  return (
    <AppLayout
      topBar={
        <div className="builder-topbar">
          <div>
            <h1>mouse-ui</h1>
            <span>v1.1.0</span>
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
          onAddComponent={addComponent}
          onSelectComponent={selectComponent}
          onChangeComponent={changeComponent}
          onChangeViewport={changeCanvasViewport}
        />
      }
      sidePanel={
        <div className="builder-side-panel">
          <InspectorPanel
            component={selectedComponent}
            onChangeComponent={changeComponent}
          />
          <CodePanel code={htmlCode} componentCount={components.length} />
        </div>
      }
    />
  );
}
