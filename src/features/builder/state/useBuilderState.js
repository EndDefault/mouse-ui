import { useState } from "react";
import { createComponent } from "../model/createComponent.js";
import { updateComponent } from "../model/updateComponent.js";

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

  function changeComponent(id, patch) {
    setComponents((currentComponents) => {
      return updateComponent(currentComponents, id, patch);
    });
  }

  return {
    components,
    selectedId,
    addComponent,
    selectComponent,
    changeComponent
  };
}
