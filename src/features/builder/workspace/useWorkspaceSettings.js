import { useEffect, useState } from "react";
import {
  DEFAULT_WORKSPACE_SETTINGS,
  normalizeWorkspaceSettings
} from "./workspaceSettings.js";

const STORAGE_KEY = "mouse-ui.builder.workspace.v1";

export function useWorkspaceSettings() {
  const [settings, setSettings] = useState(() => loadWorkspaceSettings());

  useEffect(() => {
    saveWorkspaceSettings(settings);
  }, [settings]);

  function changePanel(panelPatch) {
    setSettings((currentSettings) =>
      normalizeWorkspaceSettings({
        ...currentSettings,
        panel: {
          ...currentSettings.panel,
          ...panelPatch
        }
      })
    );
  }

  function resetPanel() {
    setSettings(DEFAULT_WORKSPACE_SETTINGS);
  }

  return {
    settings,
    changePanel,
    resetPanel
  };
}

function loadWorkspaceSettings() {
  if (!canUseStorage()) {
    return DEFAULT_WORKSPACE_SETTINGS;
  }

  try {
    const rawSettings = window.localStorage.getItem(STORAGE_KEY);

    if (!rawSettings) {
      return DEFAULT_WORKSPACE_SETTINGS;
    }

    return normalizeWorkspaceSettings(JSON.parse(rawSettings));
  } catch {
    return DEFAULT_WORKSPACE_SETTINGS;
  }
}

function saveWorkspaceSettings(settings) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(normalizeWorkspaceSettings(settings))
    );
  } catch {
    // Workspace preferences are best-effort and should not block editing.
  }
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}
