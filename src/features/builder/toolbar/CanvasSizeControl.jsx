import { useEffect, useState } from "react";
import {
  CANVAS_PRESETS,
  getCanvasPreset
} from "../model/canvasPresets.js";

export function CanvasSizeControl({ canvas, onChangeCanvasSize }) {
  const [customWidth, setCustomWidth] = useState(String(canvas.width));
  const [customHeight, setCustomHeight] = useState(String(canvas.height));

  useEffect(() => {
    setCustomWidth(String(canvas.width));
    setCustomHeight(String(canvas.height));
  }, [canvas.width, canvas.height]);

  function handlePresetChange(event) {
    const preset = getCanvasPreset(event.target.value);

    onChangeCanvasSize({
      presetId: preset.id,
      width: preset.width,
      height: preset.height
    });
  }

  function handleCustomWidthChange(event) {
    const value = event.target.value;

    setCustomWidth(value);
    onChangeCanvasSize({
      presetId: "custom",
      width: readDimension(value, canvas.width),
      height: canvas.height
    });
  }

  function handleCustomHeightChange(event) {
    const value = event.target.value;

    setCustomHeight(value);
    onChangeCanvasSize({
      presetId: "custom",
      width: canvas.width,
      height: readDimension(value, canvas.height)
    });
  }

  return (
    <section className="canvas-size-control">
      <h2>화면 크기</h2>
      <label>
        <span>프리셋</span>
        <select value={canvas.presetId} onChange={handlePresetChange}>
          {CANVAS_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </label>
      <div className="canvas-size-fields">
        <label>
          <span>W</span>
          <input
            min="240"
            type="number"
            value={customWidth}
            onChange={handleCustomWidthChange}
          />
        </label>
        <label>
          <span>H</span>
          <input
            min="240"
            type="number"
            value={customHeight}
            onChange={handleCustomHeightChange}
          />
        </label>
      </div>
    </section>
  );
}

function readDimension(value, fallbackValue) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallbackValue;
  }

  return Math.max(240, Math.round(number));
}
