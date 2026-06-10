import { useEffect, useState } from "react";
import { createComponent } from "../model/createComponent.js";
import { getCanvasPreset } from "../model/canvasPresets.js";
import { updateComponent } from "../model/updateComponent.js";
import {
  loadBuilderProject,
  saveBuilderProject
} from "../storage/builderStorage.js";
import { normalizeProject } from "../storage/projectSerializer.js";

export function useBuilderState() {
  const [project, setProject] = useState(() => loadBuilderProject());
  const { canvas, components, selectedId } = project;

  useEffect(() => {
    saveBuilderProject(project);
  }, [project]);

  function addComponent(type, options = {}) {
    setProject((currentProject) => {
      const order =
        currentProject.components.filter((component) => component.type === type)
          .length + 1;
      const component = createComponent(
        type,
        order,
        options
      );

      return touchProject({
        ...currentProject,
        components: [...currentProject.components, component],
        selectedId: component.id
      });
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
      ...touchProject(currentProject),
      components: updateComponent(currentProject.components, id, patch)
    }));
  }

  function changeCanvasSize(nextCanvas) {
    setProject((currentProject) => {
      const preset = getCanvasPreset(nextCanvas.presetId);

      return touchProject({
        ...currentProject,
        canvas: {
          ...currentProject.canvas,
          presetId: preset.id,
          width: nextCanvas.width ?? preset.width,
          height: nextCanvas.height ?? preset.height
        }
      });
    });
  }

  function changeCanvasViewport(viewportPatch) {
    setProject((currentProject) =>
      touchProject({
        ...currentProject,
        canvas: {
          ...currentProject.canvas,
          viewport: {
            ...currentProject.canvas.viewport,
            ...viewportPatch
          }
        }
      })
    );
  }

  function importProject(nextProject) {
    setProject(normalizeProject(nextProject));
  }

  return {
    project,
    canvas,
    components,
    selectedId,
    addComponent,
    selectComponent,
    changeComponent,
    changeCanvasSize,
    changeCanvasViewport,
    importProject
  };
}

function touchProject(project) {
  return {
    ...project,
    metadata: {
      ...project.metadata,
      updatedAt: new Date().toISOString()
    }
  };
}
