import { ButtonTool } from "./ButtonTool.jsx";
import { InputTool } from "./InputTool.jsx";
import { TextTool } from "./TextTool.jsx";

export function Toolbar({ onAddComponent }) {
  return (
    <div className="builder-toolbar">
      <h2>컴포넌트</h2>
      <div className="builder-tool-list">
        <ButtonTool onAdd={onAddComponent} />
        <TextTool onAdd={onAddComponent} />
        <InputTool onAdd={onAddComponent} />
      </div>
    </div>
  );
}
