import { COMPONENT_TYPES } from "../model/componentTypes.js";
import { ToolButton } from "./ToolButton.jsx";

export function DivBoxTool({ onAdd }) {
  return (
    <ToolButton
      icon="□"
      label="div 박스"
      onClick={() => onAdd(COMPONENT_TYPES.DIV_BOX)}
    />
  );
}
