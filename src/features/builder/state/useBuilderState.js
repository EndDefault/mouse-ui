import { useState } from "react";
import { createComponent } from "../model/createComponent.js";

export function useBuilderState() {
  const [components, setComponents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  function addComponent(type) {
    const component = createComponent(type, components.length + 1);

    setComponents([...components, component]);
    setSelectedId(component.id);
  }

  function selectComponent(id) {
    setSelectedId(id);
  }

  return {
    components,
    selectedId,
    addComponent,
    selectComponent
  };
}
