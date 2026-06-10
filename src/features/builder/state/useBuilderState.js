import { useEffect, useRef, useState } from "react";
import { createComponent } from "../model/createComponent.js";
import { getCanvasPreset } from "../model/canvasPresets.js";
import {
  createDefaultStyleDefaults,
  mergeStyleDefault
} from "../model/styleDefaults.js";
import { updateComponent } from "../model/updateComponent.js";
import {
  loadBuilderProject,
  saveBuilderProject
} from "../storage/builderStorage.js";
import { normalizeProject } from "../storage/projectSerializer.js";

export function useBuilderState() {
  const [project, setProject] = useState(() => loadBuilderProject());
  const [clipboard, setClipboard] = useState(null);
  const historyRef = useRef({ past: [], future: [] });
  const { canvas, components, selectedId, selectedIds, styleDefaults } = project;
  const selectedComponent =
    components.find((component) => component.id === selectedId) ?? null;

  useEffect(() => {
    saveBuilderProject(project);
  }, [project]);

  function commitProject(updater) {
    setProject((currentProject) => {
      const nextProject =
        typeof updater === "function" ? updater(currentProject) : updater;

      if (nextProject === currentProject) {
        return currentProject;
      }

      historyRef.current = {
        past: [...historyRef.current.past.slice(-4), cloneComponent(currentProject)],
        future: []
      };

      return nextProject;
    });
  }

  function addComponent(type, options = {}) {
    commitProject((currentProject) => {
      const order =
        currentProject.components.filter((component) => component.type === type)
          .length + 1;
      const component = mergeStyleDefault(
        createComponent(type, order, options),
        currentProject.styleDefaults
      );

      return touchProject({
        ...currentProject,
        components: [...currentProject.components, component],
        selectedId: component.id,
        selectedIds: [component.id]
      });
    });
  }

  function selectComponent(id, options = {}) {
    setProject((currentProject) => {
      const component = currentProject.components.find(
        (currentComponent) => currentComponent.id === id
      );

      if (component?.locked) {
        return currentProject;
      }

      if (!id || !options.toggle) {
        return {
          ...currentProject,
          selectedId: id,
          selectedIds: id ? [id] : []
        };
      }

      const nextSelectedIds = currentProject.selectedIds.includes(id)
        ? currentProject.selectedIds
        : [...currentProject.selectedIds, id];

      return {
        ...currentProject,
        selectedId: nextSelectedIds[0] ?? null,
        selectedIds: nextSelectedIds
      };
    });
  }

  function selectComponents(ids) {
    setProject((currentProject) => {
      const componentIds = new Set(
        currentProject.components
          .filter((component) => !component.locked)
          .map((component) => component.id)
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
    commitProject((currentProject) => ({
      ...touchProject(currentProject),
      components: updateComponent(
        currentProject.components,
        id,
        patch,
        { allowLocked: false }
      )
    }));
  }

  function moveComponents(ids, delta) {
    commitProject((currentProject) => {
      const movableIds = new Set(
        getMovableIds(ids, currentProject.components).filter((id) => {
          const component = currentProject.components.find(
            (currentComponent) => currentComponent.id === id
          );

          return !component?.locked;
        })
      );

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
    deleteComponents([id]);
  }

  function deleteComponents(ids) {
    commitProject((currentProject) => {
      const deletedIds = new Set();

      ids.forEach((id) => {
        getComponentFamilyIds(id, currentProject.components).forEach((familyId) => {
          deletedIds.add(familyId);
        });
      });

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

  function setComponentLocked(id, locked) {
    commitProject((currentProject) => {
      const nextSelectedIds = locked
        ? currentProject.selectedIds.filter((selectedId) => selectedId !== id)
        : currentProject.selectedIds;

      return touchProject({
        ...currentProject,
        components: updateComponent(
          currentProject.components,
          id,
          { locked },
          { allowLocked: true }
        ),
        selectedId: nextSelectedIds[0] ?? null,
        selectedIds: nextSelectedIds
      });
    });
  }

  function copyComponents(ids = selectedIds) {
    const copiedIds = getCopiedIds(ids, components);
    const copiedComponents = components.filter((component) =>
      copiedIds.has(component.id)
    );

    if (copiedComponents.length > 0) {
      setClipboard({
        components: copiedComponents.map(cloneComponent)
      });
    }
  }

  function pasteComponents(options = {}) {
    if (!clipboard?.components.length) {
      return;
    }

    commitProject((currentProject) => {
      const copiedIds = new Set(
        clipboard.components.map((component) => component.id)
      );
      const rootComponents = clipboard.components.filter(
        (component) => !component.parentId || !copiedIds.has(component.parentId)
      );
      const nextIds = createPasteIdMap(
        clipboard.components,
        currentProject.components
      );
      const pasteDelta = getPasteDelta(rootComponents, options);
      const nextComponents = clipboard.components.map((component) => {
        const isRoot = rootComponents.some((root) => root.id === component.id);
        const nextComponent = cloneComponent(component);

        return {
          ...nextComponent,
          id: nextIds.get(component.id),
          parentId: copiedIds.has(component.parentId)
            ? nextIds.get(component.parentId)
            : isRoot && "parentId" in options
              ? options.parentId
              : component.parentId,
          x: isRoot ? Math.max(0, component.x + pasteDelta.x) : component.x,
          y: isRoot ? Math.max(0, component.y + pasteDelta.y) : component.y
        };
      });
      const nextSelectedIds = nextComponents.map((component) => component.id);

      return touchProject({
        ...currentProject,
        components: [...currentProject.components, ...nextComponents],
        selectedId: nextSelectedIds[0] ?? null,
        selectedIds: nextSelectedIds
      });
    });
  }

  function changeCanvasSize(nextCanvas) {
    commitProject((currentProject) => {
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
    commitProject((currentProject) =>
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

  function changeStyleDefaultColor(color) {
    commitProject((currentProject) =>
      touchProject({
        ...currentProject,
        styleDefaults: {
          ...currentProject.styleDefaults,
          color
        }
      })
    );
  }

  function applyStyleDefaultToSelected() {
    if (!selectedComponent) {
      return;
    }

    const defaultColor = styleDefaults?.color;

    if (!defaultColor) {
      return;
    }

    changeComponent(selectedComponent.id, {
      style: mergeStyleDefault(selectedComponent, styleDefaults).style
    });
  }

  function resetStyleDefaults() {
    commitProject((currentProject) =>
      touchProject({
        ...currentProject,
        styleDefaults: createDefaultStyleDefaults()
      })
    );
  }

  function alignSelectedComponents(axis) {
    commitProject((currentProject) => {
      const targetComponents = getGroupOperationComponents(
        currentProject.selectedIds,
        currentProject.components
      );

      if (targetComponents.length < 2) {
        return currentProject;
      }

      const nextComponents = alignComponents(
        currentProject.components,
        targetComponents,
        axis
      );

      return touchProject({
        ...currentProject,
        components: nextComponents
      });
    });
  }

  function distributeSelectedComponents(axis) {
    commitProject((currentProject) => {
      const targetComponents = getGroupOperationComponents(
        currentProject.selectedIds,
        currentProject.components
      );

      if (targetComponents.length < 3) {
        return currentProject;
      }

      const nextComponents = distributeComponents(
        currentProject.components,
        targetComponents,
        axis
      );

      return touchProject({
        ...currentProject,
        components: nextComponents
      });
    });
  }

  function importProject(nextProject) {
    commitProject(normalizeProject(nextProject));
  }

  function undoProject() {
    setProject((currentProject) => {
      const previousProject = historyRef.current.past.at(-1);

      if (!previousProject) {
        return currentProject;
      }

      historyRef.current = {
        past: historyRef.current.past.slice(0, -1),
        future: [cloneComponent(currentProject), ...historyRef.current.future].slice(0, 5)
      };

      return previousProject;
    });
  }

  function redoProject() {
    setProject((currentProject) => {
      const nextProject = historyRef.current.future[0];

      if (!nextProject) {
        return currentProject;
      }

      historyRef.current = {
        past: [...historyRef.current.past.slice(-4), cloneComponent(currentProject)],
        future: historyRef.current.future.slice(1)
      };

      return nextProject;
    });
  }

  return {
    project,
    canvas,
    components,
    selectedId,
    selectedIds,
    styleDefaults,
    addComponent,
    selectComponent,
    selectComponents,
    changeComponent,
    moveComponents,
    deleteComponent,
    deleteComponents,
    setComponentLocked,
    changeStyleDefaultColor,
    applyStyleDefaultToSelected,
    resetStyleDefaults,
    alignSelectedComponents,
    distributeSelectedComponents,
    copyComponents,
    pasteComponents,
    hasClipboard: Boolean(clipboard?.components.length),
    changeCanvasSize,
    changeCanvasViewport,
    undoProject,
    redoProject,
    importProject
  };
}

function getCopiedIds(ids, components) {
  const copiedIds = new Set();

  ids.forEach((id) => {
    getComponentFamilyIds(id, components).forEach((familyId) => {
      copiedIds.add(familyId);
    });
  });

  return copiedIds;
}

function cloneComponent(component) {
  return JSON.parse(JSON.stringify(component));
}

function createPasteIdMap(copiedComponents, currentComponents) {
  const counts = new Map();
  const idMap = new Map();

  currentComponents.forEach((component) => {
    counts.set(component.type, Math.max(counts.get(component.type) ?? 0, readIdNumber(component.id)));
  });

  copiedComponents.forEach((component) => {
    const nextCount = (counts.get(component.type) ?? 0) + 1;

    counts.set(component.type, nextCount);
    idMap.set(component.id, `${getIdPrefix(component.type)}-${nextCount}`);
  });

  return idMap;
}

function getIdPrefix(type) {
  if (type === "divBox") {
    return "div-box";
  }

  return type;
}

function readIdNumber(id) {
  const match = String(id).match(/-(\d+)$/);

  return match ? Number(match[1]) : 0;
}

function getPasteDelta(rootComponents, options) {
  if (!rootComponents.length) {
    return { x: 24, y: 24 };
  }

  if (options.x == null || options.y == null) {
    return { x: 24, y: 24 };
  }

  const minX = Math.min(...rootComponents.map((component) => component.x));
  const minY = Math.min(...rootComponents.map((component) => component.y));

  return {
    x: Math.round(options.x) - minX,
    y: Math.round(options.y) - minY
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

function getGroupOperationComponents(ids, components) {
  if (ids.length === 0) {
    return [];
  }

  const selectedIds = new Set(ids);
  const selectedComponents = components.filter(
    (component) => selectedIds.has(component.id) && !component.locked
  );
  const parentId = selectedComponents[0]?.parentId ?? null;

  return selectedComponents.filter(
    (component) => (component.parentId ?? null) === parentId
  );
}

function alignComponents(components, targetComponents, axis) {
  const targetIds = new Set(targetComponents.map((component) => component.id));

  if (axis === "horizontal") {
    const centerY = Math.round(
      targetComponents.reduce(
        (sum, component) => sum + component.y + component.height / 2,
        0
      ) / targetComponents.length
    );

    return components.map((component) =>
      targetIds.has(component.id)
        ? {
            ...component,
            y: Math.max(0, Math.round(centerY - component.height / 2))
          }
        : component
    );
  }

  const centerX = Math.round(
    targetComponents.reduce(
      (sum, component) => sum + component.x + component.width / 2,
      0
    ) / targetComponents.length
  );

  return components.map((component) =>
    targetIds.has(component.id)
      ? {
          ...component,
          x: Math.max(0, Math.round(centerX - component.width / 2))
        }
      : component
  );
}

function distributeComponents(components, targetComponents, axis) {
  const sortedComponents = [...targetComponents].sort((a, b) =>
    axis === "horizontal" ? a.x - b.x : a.y - b.y
  );
  const first = sortedComponents[0];
  const last = sortedComponents.at(-1);
  const totalSize = sortedComponents.reduce(
    (sum, component) =>
      sum + (axis === "horizontal" ? component.width : component.height),
    0
  );
  const start = axis === "horizontal" ? first.x : first.y;
  const end =
    axis === "horizontal" ? last.x + last.width : last.y + last.height;
  const gap = Math.max(0, Math.round((end - start - totalSize) / (sortedComponents.length - 1)));
  const nextPositions = new Map();
  let cursor = start;

  sortedComponents.forEach((component) => {
    nextPositions.set(component.id, cursor);
    cursor += (axis === "horizontal" ? component.width : component.height) + gap;
  });

  return components.map((component) => {
    const nextPosition = nextPositions.get(component.id);

    if (nextPosition == null) {
      return component;
    }

    return axis === "horizontal"
      ? { ...component, x: Math.max(0, Math.round(nextPosition)) }
      : { ...component, y: Math.max(0, Math.round(nextPosition)) };
  });
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
