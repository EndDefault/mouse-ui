const STORAGE_KEY = "mouse-ui.builder.project.v1";
const EMPTY_PROJECT = {
  components: [],
  selectedId: null
};

export function loadBuilderProject() {
  if (!canUseStorage()) {
    return EMPTY_PROJECT;
  }

  try {
    const rawProject = window.localStorage.getItem(STORAGE_KEY);

    if (!rawProject) {
      return EMPTY_PROJECT;
    }

    return normalizeProject(JSON.parse(rawProject));
  } catch {
    return EMPTY_PROJECT;
  }
}

export function saveBuilderProject(project) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(normalizeProject(project))
    );
  } catch {
    // Saving is best-effort. The builder should keep working if storage fails.
  }
}

function normalizeProject(project) {
  const components = Array.isArray(project?.components)
    ? project.components
    : [];
  const selectedId = components.some(
    (component) => component.id === project?.selectedId
  )
    ? project.selectedId
    : null;

  return {
    components,
    selectedId
  };
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}
