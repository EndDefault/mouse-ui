export function updateComponent(components, id, patch) {
  return components.map((component) => {
    if (component.id !== id) {
      return component;
    }

    return {
      ...component,
      ...patch,
      props: patch.props ? { ...component.props, ...patch.props } : component.props,
      style: patch.style ? mergeStyle(component.style, patch.style) : component.style
    };
  });
}

function mergeStyle(currentStyle = {}, patchStyle = {}) {
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
