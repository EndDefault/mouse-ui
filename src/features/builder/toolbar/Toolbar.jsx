import { ButtonTool } from "./ButtonTool.jsx";
import { BoxTool } from "./BoxTool.jsx";
import { InputTool } from "./InputTool.jsx";
import { ProjectJsonControls } from "./ProjectJsonControls.jsx";
import { TextTool } from "./TextTool.jsx";

export function Toolbar({
  components,
  selectedId,
  onAddComponent,
  onImportProject
}) {
  return (
    <div className="builder-toolbar">
      <h2>컴포넌트</h2>
      <div className="builder-tool-list">
        <ButtonTool onAdd={onAddComponent} />
        <TextTool onAdd={onAddComponent} />
        <InputTool onAdd={onAddComponent} />
        <BoxTool onAdd={onAddComponent} />
      </div>
      <ProjectJsonControls
        project={{ components, selectedId }}
        onImportProject={onImportProject}
      />
    </div>
  );
}
