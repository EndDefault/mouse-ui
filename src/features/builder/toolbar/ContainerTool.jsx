import { COMPONENT_TYPES } from "../model/componentTypes.js";
import { ToolButton } from "./ToolButton.jsx";

export function ContainerTool({ onAdd }) {
  return (
    <ToolButton
      icon="[]"
      label="컨테이너"
      title="컨테이너 추가"
      onClick={() => onAdd(COMPONENT_TYPES.CONTAINER)}
    />
  );
}
