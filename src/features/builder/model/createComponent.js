import { COMPONENT_TYPES } from "./componentTypes.js";

export function createComponent(type, order) {
  if (type === COMPONENT_TYPES.BUTTON) {
    return createButtonComponent(order);
  }

  throw new Error(`Unsupported component type: ${type}`);
}

function createButtonComponent(order) {
  const offset = (order - 1) * 16;

  return {
    id: `button-${order}`,
    type: COMPONENT_TYPES.BUTTON,
    text: "버튼",
    x: 96 + offset,
    y: 80 + offset,
    width: 132,
    height: 44,
    style: {
      backgroundColor: "#2f9e8f",
      color: "#ffffff",
      borderRadius: 8
    }
  };
}
