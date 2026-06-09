import { COMPONENT_TYPES } from "./componentTypes.js";

export function createComponent(type, order) {
  if (type === COMPONENT_TYPES.BUTTON) {
    return createButtonComponent(order);
  }

  if (type === COMPONENT_TYPES.TEXT) {
    return createTextComponent(order);
  }

  throw new Error(`Unsupported component type: ${type}`);
}

function createTextComponent(order) {
  const offset = (order - 1) * 16;

  return {
    id: `text-${order}`,
    type: COMPONENT_TYPES.TEXT,
    text: "텍스트",
    x: 112 + offset,
    y: 104 + offset,
    width: 180,
    height: 40,
    style: {
      color: "#24211f",
      fontSize: 18
    }
  };
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
