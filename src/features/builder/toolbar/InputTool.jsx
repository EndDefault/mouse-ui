import { COMPONENT_TYPES } from "../model/componentTypes.js";
import { ToolButton } from "./ToolButton.jsx";

export function InputTool({ onAdd }) {
  return (
    <ToolButton
      icon="I"
      label="입력창"
      title="입력창 추가"
      onClick={() => onAdd(COMPONENT_TYPES.INPUT)}
    />
  );
}
