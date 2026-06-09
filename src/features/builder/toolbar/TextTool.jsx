import { COMPONENT_TYPES } from "../model/componentTypes.js";
import { ToolButton } from "./ToolButton.jsx";

export function TextTool({ onAdd }) {
  return (
    <ToolButton
      icon="T"
      label="텍스트"
      title="텍스트 추가"
      onClick={() => onAdd(COMPONENT_TYPES.TEXT)}
    />
  );
}
