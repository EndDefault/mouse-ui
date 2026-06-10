import { COMPONENT_TYPES } from "./componentTypes.js";
import { DEFAULT_BORDER, DEFAULT_SHADOW } from "./styleValues.js";

export function createComponent(type, order, options = {}) {
  if (type === COMPONENT_TYPES.BUTTON) {
    return applyCreateOptions(createButtonComponent(order), options);
  }

  if (type === COMPONENT_TYPES.TEXT) {
    return applyCreateOptions(createTextComponent(order), options);
  }

  if (type === COMPONENT_TYPES.INPUT) {
    return applyCreateOptions(createInputComponent(order), options);
  }

  if (type === COMPONENT_TYPES.CONTAINER) {
    return applyCreateOptions(createContainerComponent(order), options);
  }

  if (type === COMPONENT_TYPES.IMAGE) {
    return applyCreateOptions(createImageComponent(order), options);
  }

  throw new Error(`Unsupported component type: ${type}`);
}

function applyCreateOptions(component, options) {
  return {
    ...component,
    parentId: options.parentId ?? component.parentId,
    x: options.x ?? component.x,
    y: options.y ?? component.y
  };
}

function createInputComponent(order) {
  const offset = (order - 1) * 16;

  return {
    id: `input-${order}`,
    type: COMPONENT_TYPES.INPUT,
    parentId: null,
    name: "Input",
    x: 128 + offset,
    y: 120 + offset,
    width: 240,
    height: 68,
    props: {
      label: "이메일",
      showLabel: true,
      placeholder: "이메일을 입력하세요",
      inputType: "email"
    },
    style: createElementStyle({
      background: {
        type: "solid",
        color: "#ffffff",
        gradient: null
      },
      color: "#24211f",
      borderRadius: 8
    }),
    interactions: []
  };
}

function createTextComponent(order) {
  const offset = (order - 1) * 16;

  return {
    id: `text-${order}`,
    type: COMPONENT_TYPES.TEXT,
    parentId: null,
    name: "Text",
    x: 112 + offset,
    y: 104 + offset,
    width: 180,
    height: 40,
    props: {
      text: "텍스트"
    },
    style: createElementStyle({
      color: "#24211f",
      fontSize: 18,
      borderRadius: 0
    }),
    interactions: []
  };
}

function createButtonComponent(order) {
  const offset = (order - 1) * 16;

  return {
    id: `button-${order}`,
    type: COMPONENT_TYPES.BUTTON,
    parentId: null,
    name: "Button",
    x: 96 + offset,
    y: 80 + offset,
    width: 132,
    height: 44,
    props: {
      text: "버튼"
    },
    style: createElementStyle({
      background: {
        type: "solid",
        color: "#2f9e8f",
        gradient: null
      },
      color: "#ffffff",
      borderRadius: 8
    }),
    interactions: []
  };
}

function createContainerComponent(order) {
  const offset = (order - 1) * 16;

  return {
    id: `container-${order}`,
    type: COMPONENT_TYPES.CONTAINER,
    parentId: null,
    name: "Container",
    x: 80 + offset,
    y: 72 + offset,
    width: 320,
    height: 220,
    props: {},
    style: createElementStyle({
      background: {
        type: "solid",
        color: "#ffffff",
        gradient: null
      },
      color: "#24211f",
      borderRadius: 14
    }),
    interactions: []
  };
}

function createImageComponent(order) {
  const offset = (order - 1) * 16;

  return {
    id: `image-${order}`,
    type: COMPONENT_TYPES.IMAGE,
    parentId: null,
    name: "Image",
    x: 160 + offset,
    y: 144 + offset,
    width: 180,
    height: 120,
    props: {
      src: "",
      alt: "이미지"
    },
    style: createElementStyle({
      background: {
        type: "solid",
        color: "#e8f2ef",
        gradient: null
      },
      borderRadius: 10
    }),
    interactions: []
  };
}

function createElementStyle(style) {
  return {
    ...style,
    opacity: 1,
    shadow: { ...DEFAULT_SHADOW },
    border: { ...DEFAULT_BORDER }
  };
}
