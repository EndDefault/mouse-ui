import { COMPONENT_TYPES } from "../model/componentTypes.js";
import { ToolButton } from "./ToolButton.jsx";

export function BoxTool({ onAdd }) {
  return (
    <ToolButton
      icon="□"
      label="박스"
      title="박스 추가"
      onClick={() => onAdd(COMPONENT_TYPES.BOX)}
    />
  );
}
