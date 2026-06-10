import { COMPONENT_TYPES } from "./componentTypes.js";

const DEFAULT_STYLE_COLOR = "#2f9e8f";

export function createDefaultStyleDefaults() {
  return {
    color: DEFAULT_STYLE_COLOR
  };
}

export function mergeStyleDefault(component, styleDefaults) {
  const color = styleDefaults?.color;

  if (!color) {
    return component;
  }

  return {
    ...component,
    style: mergeStyle(component.style, getColorStylePatch(component.type, color))
  };
}

export function mergeStyle(currentStyle = {}, patchStyle = {}) {
  const nextStyle = {
    ...currentStyle,
    ...patchStyle
  };

  if (patchStyle.background) {
    nextStyle.background = {
      ...currentStyle.background,
      ...patchStyle.background,
      gradient:
        patchStyle.background.gradient === null
          ? null
          : {
              ...currentStyle.background?.gradient,
              ...patchStyle.background.gradient
            }
    };
  }

  if (patchStyle.shadow) {
    nextStyle.shadow = {
      ...currentStyle.shadow,
      ...patchStyle.shadow
    };
  }

  if (patchStyle.border) {
    nextStyle.border = {
      ...currentStyle.border,
      ...patchStyle.border
    };
  }

  return nextStyle;
}

function createBackground(color) {
  return {
    type: "solid",
    color,
    gradient: null
  };
}

function getColorStylePatch(type, color) {
  if (type === COMPONENT_TYPES.TEXT) {
    return { color };
  }

  if (type === COMPONENT_TYPES.DIV_BOX || type === COMPONENT_TYPES.IMAGE) {
    return {
      background: createBackground(color)
    };
  }

  return {
    background: createBackground(color),
    color: type === COMPONENT_TYPES.BUTTON ? "#ffffff" : "#24211f"
  };
}
