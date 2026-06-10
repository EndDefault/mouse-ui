export const DEFAULT_CANVAS_PRESET_ID = "desktop-16";

export const CANVAS_PRESETS = [
  {
    id: "desktop-16",
    label: "16인치",
    width: 1536,
    height: 864
  },
  {
    id: "desktop-14",
    label: "14인치",
    width: 1366,
    height: 768
  },
  {
    id: "tablet",
    label: "태블릿",
    width: 834,
    height: 1112
  },
  {
    id: "mobile",
    label: "모바일",
    width: 390,
    height: 844
  },
  {
    id: "custom",
    label: "커스텀",
    width: 1200,
    height: 800
  }
];

export function getCanvasPreset(presetId) {
  return (
    CANVAS_PRESETS.find((preset) => preset.id === presetId) ??
    CANVAS_PRESETS[0]
  );
}
