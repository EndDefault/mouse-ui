import { ButtonTool } from "./ButtonTool.jsx";
import { CanvasSizeControl } from "./CanvasSizeControl.jsx";
import { ContainerTool } from "./ContainerTool.jsx";
import { InputTool } from "./InputTool.jsx";
import { ProjectJsonControls } from "./ProjectJsonControls.jsx";
import { TextTool } from "./TextTool.jsx";

export function Toolbar({
  project,
  canvas,
  onAddComponent,
  onChangeCanvasSize,
  onImportProject
}) {
  return (
    <div className="builder-toolbar">
      <h2>컴포넌트</h2>
      <div className="builder-tool-list">
        <ButtonTool onAdd={onAddComponent} />
        <TextTool onAdd={onAddComponent} />
        <InputTool onAdd={onAddComponent} />
        <ContainerTool onAdd={onAddComponent} />
      </div>
      <CanvasSizeControl
        canvas={canvas}
        onChangeCanvasSize={onChangeCanvasSize}
      />
      <ProjectJsonControls
        project={project}
        onImportProject={onImportProject}
      />
    </div>
  );
}
