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
    components,
    selectedId,
    addComponent,
    selectComponent,
    changeComponent
  } = useBuilderState();
  const htmlCode = generateHtml(components);
  const selectedComponent =
    components.find((component) => component.id === selectedId) ?? null;

  return (
    <AppLayout
      topBar={
        <div className="builder-topbar">
          <div>
            <h1>mouse-ui</h1>
            <span>v0.3.0</span>
          </div>
          <strong>속성 패널</strong>
        </div>
      }
      toolbar={<Toolbar onAddComponent={addComponent} />}
      canvas={
        <Canvas
          components={components}
          selectedId={selectedId}
          onSelectComponent={selectComponent}
          onChangeComponent={changeComponent}
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
