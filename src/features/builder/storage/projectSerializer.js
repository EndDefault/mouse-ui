import { COMPONENT_TYPES } from "../model/componentTypes.js";

const SERIALIZER_VERSION = 1;
const SUPPORTED_TYPES = new Set(Object.values(COMPONENT_TYPES));

export function serializeProject(project) {
  return JSON.stringify(
    {
      version: SERIALIZER_VERSION,
      ...normalizeProject(project)
    },
    null,
    2
  );
}

export function parseProjectJson(value) {
  return normalizeProject(JSON.parse(value));
}

export function normalizeProject(project) {
  const components = Array.isArray(project?.components)
    ? project.components.map(normalizeComponent).filter(Boolean)
    : [];
  const selectedId = components.some(
    (component) => component.id === project?.selectedId
  )
    ? project.selectedId
    : null;

  return {
    components,
    selectedId
  };
}

function normalizeComponent(component, index) {
  if (!SUPPORTED_TYPES.has(component?.type)) {
    return null;
  }

  const common = {
    id: readString(component.id, `${component.type}-${index + 1}`),
    type: component.type,
    x: readNumber(component.x, 96),
    y: readNumber(component.y, 80),
    width: readNumber(component.width, 120, 32),
    height: readNumber(component.height, 40, 24),
    style: readObject(component.style)
  };

  if (common.type === COMPONENT_TYPES.BUTTON) {
    return {
      ...common,
      text: readString(component.text, "버튼"),
      style: {
        backgroundColor: readString(common.style.backgroundColor, "#2f9e8f"),
        color: readString(common.style.color, "#ffffff"),
        borderRadius: readNumber(common.style.borderRadius, 8)
      }
    };
  }

  if (common.type === COMPONENT_TYPES.TEXT) {
    return {
      ...common,
      text: readString(component.text, "텍스트"),
      style: {
        color: readString(common.style.color, "#24211f"),
        fontSize: readNumber(common.style.fontSize, 18, 8)
      }
    };
  }

  if (common.type === COMPONENT_TYPES.INPUT) {
    return {
      ...common,
      label: readString(component.label, "이메일"),
      placeholder: readString(component.placeholder, "이메일을 입력하세요"),
      inputType: readString(component.inputType, "email"),
      style: {
        backgroundColor: readString(common.style.backgroundColor, "#ffffff"),
        color: readString(common.style.color, "#24211f"),
        borderRadius: readNumber(common.style.borderRadius, 8)
      }
    };
  }

  if (common.type === COMPONENT_TYPES.BOX) {
    return {
      ...common,
      style: {
        backgroundColor: readString(common.style.backgroundColor, "#f0b35a"),
        borderRadius: readNumber(common.style.borderRadius, 12)
      }
    };
  }

  return null;
}

function readObject(value) {
  return value && typeof value === "object" ? value : {};
}

function readString(value, fallbackValue) {
  return typeof value === "string" ? value : fallbackValue;
}

function readNumber(value, fallbackValue, minValue = 0) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallbackValue;
  }

  return Math.max(minValue, Math.round(number));
}
