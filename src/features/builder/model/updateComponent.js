import { mergeStyle } from "./styleDefaults.js";

export function updateComponent(components, id, patch, options = {}) {
  return components.map((component) => {
    if (component.id !== id) {
      return component;
    }

    if (component.locked && !options.allowLocked) {
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
