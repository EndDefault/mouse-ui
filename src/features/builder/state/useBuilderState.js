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
  const { canvas, components, selectedId, selectedIds } = project;

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
        selectedId: component.id,
        selectedIds: [component.id]
      });
    });
  }

  function selectComponent(id) {
    setProject((currentProject) => ({
      ...currentProject,
      selectedId: id,
      selectedIds: id ? [id] : []
    }));
  }

  function selectComponents(ids) {
    setProject((currentProject) => {
      const componentIds = new Set(
        currentProject.components.map((component) => component.id)
      );
      const nextSelectedIds = ids.filter((id) => componentIds.has(id));

      return {
        ...currentProject,
        selectedId: nextSelectedIds[0] ?? null,
        selectedIds: nextSelectedIds
      };
    });
  }

  function changeComponent(id, patch) {
    setProject((currentProject) => ({
      ...touchProject(currentProject),
      components: updateComponent(currentProject.components, id, patch)
    }));
  }

  function moveComponents(ids, delta) {
    setProject((currentProject) => {
      const movableIds = new Set(getMovableIds(ids, currentProject.components));

      if (movableIds.size === 0) {
        return currentProject;
      }

      return touchProject({
        ...currentProject,
        components: currentProject.components.map((component) => {
          if (!movableIds.has(component.id)) {
            return component;
          }

          return {
            ...component,
            x: Math.max(0, component.x + delta.x),
            y: Math.max(0, component.y + delta.y)
          };
        })
      });
    });
  }

  function deleteComponent(id) {
    setProject((currentProject) => {
      const deletedIds = getComponentFamilyIds(id, currentProject.components);
      const nextComponents = currentProject.components.filter(
        (component) => !deletedIds.has(component.id)
      );
      const nextSelectedIds = currentProject.selectedIds.filter(
        (selectedComponentId) => !deletedIds.has(selectedComponentId)
      );

      return touchProject({
        ...currentProject,
        components: nextComponents,
        selectedId: nextSelectedIds[0] ?? null,
        selectedIds: nextSelectedIds
      });
    });
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
    selectedIds,
    addComponent,
    selectComponent,
    selectComponents,
    changeComponent,
    moveComponents,
    deleteComponent,
    changeCanvasSize,
    changeCanvasViewport,
    importProject
  };
}

function getComponentFamilyIds(id, components) {
  const ids = new Set([id]);
  let changed = true;

  while (changed) {
    changed = false;
    components.forEach((component) => {
      if (component.parentId && ids.has(component.parentId) && !ids.has(component.id)) {
        ids.add(component.id);
        changed = true;
      }
    });
  }

  return ids;
}

function getMovableIds(ids, components) {
  const selectedIds = new Set(ids);

  return ids.filter((id) => !hasSelectedAncestor(id, selectedIds, components));
}

function hasSelectedAncestor(id, selectedIds, components) {
  const componentsById = new Map(
    components.map((component) => [component.id, component])
  );
  let parentId = componentsById.get(id)?.parentId;

  while (parentId) {
    if (selectedIds.has(parentId)) {
      return true;
    }

    parentId = componentsById.get(parentId)?.parentId;
  }

  return false;
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
