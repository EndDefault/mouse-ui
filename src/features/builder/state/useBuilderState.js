import { useEffect, useState } from "react";
import { createComponent } from "../model/createComponent.js";
import { updateComponent } from "../model/updateComponent.js";
import {
  loadBuilderProject,
  saveBuilderProject
} from "../storage/builderStorage.js";

export function useBuilderState() {
  const [project, setProject] = useState(() => loadBuilderProject());
  const { components, selectedId } = project;

  useEffect(() => {
    saveBuilderProject(project);
  }, [project]);

  function addComponent(type) {
    setProject((currentProject) => {
      const component = createComponent(
        type,
        currentProject.components.length + 1
      );

      return {
        components: [...currentProject.components, component],
        selectedId: component.id
      };
    });
  }

  function selectComponent(id) {
    setProject((currentProject) => ({
      ...currentProject,
      selectedId: id
    }));
  }

  function changeComponent(id, patch) {
    setProject((currentProject) => ({
      ...currentProject,
      components: updateComponent(currentProject.components, id, patch)
    }));
  }

  return {
    components,
    selectedId,
    addComponent,
    selectComponent,
    changeComponent
  };
}
