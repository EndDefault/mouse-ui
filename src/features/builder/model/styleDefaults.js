import { COMPONENT_TYPES } from "./componentTypes.js";
import { DEFAULT_BORDER, DEFAULT_SHADOW } from "./styleValues.js";

export function createDefaultStyleDefaults() {
  return {
    [COMPONENT_TYPES.BUTTON]: {
      style: createVisualStyle({
        background: createBackground("#2f9e8f"),
        color: "#ffffff",
        borderRadius: 8
      })
    },
    [COMPONENT_TYPES.TEXT]: {
      style: createVisualStyle({
        color: "#24211f",
        fontSize: 18,
        borderRadius: 0
      })
    },
    [COMPONENT_TYPES.INPUT]: {
      style: createVisualStyle({
        background: createBackground("#ffffff"),
        color: "#24211f",
        borderRadius: 8
      })
    },
    [COMPONENT_TYPES.CONTAINER]: {
      style: createVisualStyle({
        background: createBackground("#ffffff"),
        color: "#24211f",
        borderRadius: 14
      })
    },
    [COMPONENT_TYPES.DIV_BOX]: {
      style: createVisualStyle({
        background: createBackground("#f7c873"),
        borderRadius: 16
      })
    }
  };
}

export function mergeStyleDefault(component, styleDefaults) {
  const defaultStyle = styleDefaults?.[component.type]?.style;

  if (!defaultStyle) {
    return component;
  }

  return {
    ...component,
    style: mergeStyle(component.style, defaultStyle)
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

function createVisualStyle(style) {
  return {
    ...style,
    opacity: 1,
    shadow: { ...DEFAULT_SHADOW },
    border: { ...DEFAULT_BORDER }
  };
}
