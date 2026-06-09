import { COMPONENT_TYPES } from "../model/componentTypes.js";
import { ToolButton } from "./ToolButton.jsx";

export function ButtonTool({ onAdd }) {
  return (
    <ToolButton
      icon="+"
      label="버튼"
      title="버튼 추가"
      onClick={() => onAdd(COMPONENT_TYPES.BUTTON)}
    />
  );
}
