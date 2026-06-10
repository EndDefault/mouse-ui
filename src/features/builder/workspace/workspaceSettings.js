export const BUILDER_PANEL_TABS = {
  ADJUST: "adjust",
  STYLE: "style",
  ANIMATION: "animation",
  LOCKED: "locked",
  THEME: "theme",
  HTML: "html"
};

export const DEFAULT_WORKSPACE_SETTINGS = {
  panel: {
    isDocked: true,
    x: 24,
    y: 24,
    width: 380,
    height: 640,
    activeTab: BUILDER_PANEL_TABS.ADJUST
  }
};

export function normalizeWorkspaceSettings(settings) {
  const panel = settings?.panel ?? {};
  const defaultPanel = DEFAULT_WORKSPACE_SETTINGS.panel;

  return {
    panel: {
      isDocked:
        typeof panel.isDocked === "boolean"
          ? panel.isDocked
          : defaultPanel.isDocked,
      x: readNumber(panel.x, defaultPanel.x, 0, 10000),
      y: readNumber(panel.y, defaultPanel.y, 0, 10000),
      width: readNumber(panel.width, defaultPanel.width, 300, 720),
      height: readNumber(panel.height, defaultPanel.height, 360, 1200),
      activeTab: isPanelTab(panel.activeTab)
        ? panel.activeTab
        : defaultPanel.activeTab
    }
  };
}

function isPanelTab(value) {
  return Object.values(BUILDER_PANEL_TABS).includes(value);
}

function readNumber(value, fallbackValue, minValue, maxValue) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallbackValue;
  }

  return Math.min(maxValue, Math.max(minValue, Math.round(number)));
}
