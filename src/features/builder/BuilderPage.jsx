import { AppLayout } from "../../app/AppLayout.jsx";
import { Canvas } from "./canvas/Canvas.jsx";
import { CodePanel } from "./code/CodePanel.jsx";
import { generateHtml } from "./codegen/generateHtml.js";
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

  return (
    <AppLayout
      topBar={
        <div className="builder-topbar">
          <div>
            <h1>mouse-ui</h1>
            <span>v0.2.0</span>
          </div>
          <strong>기본 UI 빌더</strong>
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
        <CodePanel code={htmlCode} componentCount={components.length} />
      }
    />
  );
}
