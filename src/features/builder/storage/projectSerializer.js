import {
  DEFAULT_CANVAS_PRESET_ID,
  getCanvasPreset
} from "../model/canvasPresets.js";
import {
  COMPONENT_TYPES,
  LEGACY_COMPONENT_TYPES
} from "../model/componentTypes.js";
import { createDefaultStyleDefaults } from "../model/styleDefaults.js";
import { DEFAULT_BORDER, DEFAULT_SHADOW } from "../model/styleValues.js";

const SCHEMA_VERSION = 1;
const SUPPORTED_TYPES = new Set([
  ...Object.values(COMPONENT_TYPES),
  ...Object.values(LEGACY_COMPONENT_TYPES)
]);
const INTERACTION_EVENTS = new Set(["hover", "click", "enter", "stateChange"]);
const ANIMATION_TYPES = new Set(["move", "color", "flyOut", "scale", "opacity"]);

export function createEmptyProject() {
  const now = new Date().toISOString();
  const preset = getCanvasPreset(DEFAULT_CANVAS_PRESET_ID);

  return {
    schemaVersion: SCHEMA_VERSION,
    name: "Untitled",
    canvas: {
      presetId: preset.id,
      width: preset.width,
      height: preset.height,
      unit: "px",
      viewport: {
        zoom: 1,
        panX: 0,
        panY: 0
      }
    },
    components: [],
    selectedId: null,
    selectedIds: [],
    styleDefaults: createDefaultStyleDefaults(),
    metadata: {
      createdAt: now,
      updatedAt: now
    }
  };
}

export function serializeProject(project) {
  return JSON.stringify(normalizeProject(project), null, 2);
}

export function parseProjectJson(value) {
  return normalizeProject(JSON.parse(value));
}

export function normalizeProject(project) {
  const emptyProject = createEmptyProject();
  const components = Array.isArray(project?.components)
    ? project.components.map(normalizeComponent).filter(Boolean)
    : [];
  const selectedId = components.some(
    (component) => component.id === project?.selectedId
  )
    ? project.selectedId
    : null;
  const selectedIds = normalizeSelectedIds(project?.selectedIds, components);

  return {
    schemaVersion: SCHEMA_VERSION,
    name: readString(project?.name, emptyProject.name),
    canvas: normalizeCanvas(project?.canvas, emptyProject.canvas),
    components,
    selectedId: selectedIds[0] ?? selectedId,
    selectedIds: selectedIds.length ? selectedIds : selectedId ? [selectedId] : [],
    styleDefaults: normalizeStyleDefaults(project?.styleDefaults),
    metadata: normalizeMetadata(project?.metadata, emptyProject.metadata)
  };
}

function normalizeStyleDefaults(styleDefaults) {
  const defaults = createDefaultStyleDefaults();
  const source = readObject(styleDefaults);

  return Object.fromEntries(
    Object.entries(defaults).map(([type, defaultValue]) => [
      type,
      {
        style: normalizeStyle(
          { type, style: source[type]?.style ?? defaultValue.style },
          type
        )
      }
    ])
  );
}

function normalizeSelectedIds(selectedIds, components) {
  if (!Array.isArray(selectedIds)) {
    return [];
  }

  const componentIds = new Set(components.map((component) => component.id));

  return selectedIds.filter((id) => componentIds.has(id));
}

function normalizeCanvas(canvas, fallbackCanvas) {
  const presetId = readString(canvas?.presetId, fallbackCanvas.presetId);
  const preset = getCanvasPreset(presetId);

  return {
    presetId: preset.id,
    width: readNumber(canvas?.width, preset.width, 240),
    height: readNumber(canvas?.height, preset.height, 240),
    unit: "px",
    viewport: normalizeViewport(canvas?.viewport, fallbackCanvas.viewport)
  };
}

function normalizeViewport(viewport, fallbackViewport) {
  return {
    zoom: readNumber(viewport?.zoom, fallbackViewport.zoom, 0.25, 2),
    panX: readNumber(viewport?.panX, fallbackViewport.panX, -10000, 10000),
    panY: readNumber(viewport?.panY, fallbackViewport.panY, -10000, 10000)
  };
}

function normalizeMetadata(metadata, fallbackMetadata) {
  return {
    createdAt: readString(metadata?.createdAt, fallbackMetadata.createdAt),
    updatedAt: readString(metadata?.updatedAt, fallbackMetadata.updatedAt)
  };
}

function normalizeComponent(component, index) {
  if (!SUPPORTED_TYPES.has(component?.type)) {
    return null;
  }
  const type = normalizeComponentType(component.type);

  const common = {
    id: readString(component.id, `${type}-${index + 1}`),
    type,
    parentId: readNullableString(component.parentId),
    name: readString(component.name, getDefaultName(type)),
    x: readNumber(component.x, 96),
    y: readNumber(component.y, 80),
    width: readNumber(component.width, 120, 32),
    height: readNumber(component.height, 40, 24),
    locked: component.locked === true,
    props: normalizeProps(component, type),
    style: normalizeStyle(component, type),
    interactions: normalizeInteractions(component.interactions)
  };

  return common;
}

function normalizeComponentType(type) {
  if (type === LEGACY_COMPONENT_TYPES.BOX) {
    return COMPONENT_TYPES.CONTAINER;
  }

  return type;
}

function normalizeProps(component, type) {
  const props = readObject(component.props);

  if (type === COMPONENT_TYPES.BUTTON) {
    return {
      text: readString(props.text ?? component.text, "버튼")
    };
  }

  if (type === COMPONENT_TYPES.TEXT) {
    return {
      text: readString(props.text ?? component.text, "텍스트")
    };
  }

  if (type === COMPONENT_TYPES.INPUT) {
    return {
      label: readString(props.label ?? component.label, "이메일"),
      showLabel:
        typeof props.showLabel === "boolean" ? props.showLabel : true,
      placeholder: readString(
        props.placeholder ?? component.placeholder,
        "이메일을 입력하세요"
      ),
      inputType: readString(props.inputType ?? component.inputType, "email")
    };
  }

  if (type === COMPONENT_TYPES.IMAGE) {
    return {
      src: readString(props.src ?? component.src, ""),
      alt: readString(props.alt ?? component.alt, "이미지")
    };
  }

  return {};
}

function normalizeStyle(component, type) {
  const style = readObject(component.style);

  if (type === COMPONENT_TYPES.TEXT) {
    return withVisualStyle(style, {
      color: readString(style.color, "#24211f"),
      fontSize: readNumber(style.fontSize, 18, 8),
      borderRadius: readNumber(style.borderRadius, 0)
    });
  }

  if (component.type === LEGACY_COMPONENT_TYPES.BOX) {
    return withVisualStyle(style, {
      background: normalizeBackground(style, "#f0b35a"),
      borderRadius: readNumber(style.borderRadius, 12)
    });
  }

  if (type === COMPONENT_TYPES.CONTAINER) {
    return withVisualStyle(style, {
      background: normalizeBackground(style, "#ffffff"),
      color: readString(style.color, "#24211f"),
      borderRadius: readNumber(style.borderRadius, 14)
    });
  }

  if (type === COMPONENT_TYPES.DIV_BOX) {
    return withVisualStyle(style, {
      background: normalizeBackground(style, "#f7c873"),
      borderRadius: readNumber(style.borderRadius, 16)
    });
  }

  if (type === COMPONENT_TYPES.IMAGE) {
    return withVisualStyle(style, {
      background: normalizeBackground(style, "#e8f2ef"),
      borderRadius: readNumber(style.borderRadius, 10)
    });
  }

  return withVisualStyle(style, {
    background: normalizeBackground(
      style,
      type === COMPONENT_TYPES.INPUT ? "#ffffff" : "#2f9e8f"
    ),
    color: readString(
      style.color,
      type === COMPONENT_TYPES.INPUT ? "#24211f" : "#ffffff"
    ),
    borderRadius: readNumber(style.borderRadius, 8)
  });
}

function normalizeBackground(style, fallbackColor) {
  const background = readObject(style.background);
  const gradient = normalizeGradient(background.gradient);
  const type = background.type === "gradient" && gradient ? "gradient" : "solid";

  return {
    type,
    color: readString(background.color ?? style.backgroundColor, fallbackColor),
    gradient: type === "gradient" ? gradient : null
  };
}

function normalizeGradient(gradient) {
  if (!gradient || typeof gradient !== "object") {
    return null;
  }

  return {
    kind: readString(gradient.kind, "linear"),
    direction: readString(gradient.direction, "to right"),
    from: readString(gradient.from, "#2563eb"),
    to: readString(gradient.to, "#14b8a6"),
    fromPosition: readNumber(gradient.fromPosition, 0, 0, 100),
    toPosition: readNumber(gradient.toPosition, 100, 0, 100)
  };
}

function withVisualStyle(sourceStyle, style) {
  return {
    ...style,
    opacity: readNumber(sourceStyle.opacity, 1, 0, 1),
    shadow: normalizeShadow(sourceStyle.shadow),
    border: normalizeBorder(sourceStyle.border)
  };
}

function normalizeShadow(shadowValue) {
  const shadow = readObject(shadowValue);

  return {
    enabled:
      typeof shadow.enabled === "boolean"
        ? shadow.enabled
        : DEFAULT_SHADOW.enabled,
    x: readNumber(shadow.x, DEFAULT_SHADOW.x, -100, 100),
    y: readNumber(shadow.y, DEFAULT_SHADOW.y, -100, 100),
    blur: readNumber(shadow.blur, DEFAULT_SHADOW.blur, 0, 160),
    spread: readNumber(shadow.spread, DEFAULT_SHADOW.spread, -100, 100),
    color: readString(shadow.color, DEFAULT_SHADOW.color),
    opacity: readNumber(shadow.opacity, DEFAULT_SHADOW.opacity, 0, 1)
  };
}

function normalizeBorder(borderValue) {
  const border = readObject(borderValue);
  const style = readString(border.style, DEFAULT_BORDER.style);

  return {
    enabled:
      typeof border.enabled === "boolean"
        ? border.enabled
        : DEFAULT_BORDER.enabled,
    color: readString(border.color, DEFAULT_BORDER.color),
    width: readNumber(border.width, DEFAULT_BORDER.width, 0, 24),
    style: ["solid", "dashed", "dotted"].includes(style)
      ? style
      : DEFAULT_BORDER.style
  };
}

function normalizeInteractions(interactions) {
  if (!Array.isArray(interactions)) {
    return [];
  }

  return interactions.map(normalizeInteraction).filter(Boolean);
}

function normalizeInteraction(interaction, index) {
  const animation = readObject(interaction?.animation);
  const event = readString(interaction?.event, "hover");
  const type = readString(animation.type, "opacity");

  if (!INTERACTION_EVENTS.has(event) || !ANIMATION_TYPES.has(type)) {
    return null;
  }

  return {
    id: readString(interaction.id, `interaction-${index + 1}`),
    event,
    animation: {
      type,
      to: readObject(animation.to),
      duration: readNumber(animation.duration, 300, 0, 10000),
      easing: readString(animation.easing, "ease")
    }
  };
}

function getDefaultName(type) {
  if (type === COMPONENT_TYPES.BUTTON) {
    return "Button";
  }

  if (type === COMPONENT_TYPES.TEXT) {
    return "Text";
  }

  if (type === COMPONENT_TYPES.INPUT) {
    return "Input";
  }

  if (type === COMPONENT_TYPES.CONTAINER) {
    return "Container";
  }

  if (type === COMPONENT_TYPES.DIV_BOX) {
    return "Div Box";
  }

  if (type === COMPONENT_TYPES.IMAGE) {
    return "Image";
  }

  return "Component";
}

function readObject(value) {
  return value && typeof value === "object" ? value : {};
}

function readString(value, fallbackValue) {
  return typeof value === "string" ? value : fallbackValue;
}

function readNullableString(value) {
  return typeof value === "string" && value ? value : null;
}

function readNumber(value, fallbackValue, minValue = 0, maxValue = Infinity) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallbackValue;
  }

  return Math.min(maxValue, Math.max(minValue, Math.round(number * 100) / 100));
}
