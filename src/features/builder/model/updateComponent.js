export function updateComponent(components, id, patch) {
  return components.map((component) => {
    if (component.id !== id) {
      return component;
    }

    return {
      ...component,
      ...patch,
      style: {
        ...component.style,
        ...patch.style
      }
    };
  });
}
