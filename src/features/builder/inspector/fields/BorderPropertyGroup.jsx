import { DEFAULT_BORDER } from "../../model/styleValues.js";
import { PropertyRow } from "./PropertyRow.jsx";
import { readNumberInput } from "./readNumberInput.js";

const BORDER_STYLES = [
  { value: "solid", label: "실선" },
  { value: "dashed", label: "파선" },
  { value: "dotted", label: "점선" }
];

export function BorderPropertyGroup({ border, onChange }) {
  const value = {
    ...DEFAULT_BORDER,
    ...(border ?? {})
  };

  function changeBorder(borderPatch) {
    onChange({
      border: {
        ...value,
        ...borderPatch
      }
    });
  }

  return (
    <section className="property-group">
      <h3>Border</h3>
      <label className="property-toggle">
        <input
          checked={value.enabled}
          type="checkbox"
          onChange={(event) => changeBorder({ enabled: event.target.checked })}
        />
        <span>border 사용</span>
      </label>
      {value.enabled ? (
        <div className="property-grid">
          <PropertyRow label="색상">
            <input
              type="color"
              value={value.color}
              onChange={(event) => changeBorder({ color: event.target.value })}
            />
          </PropertyRow>
          <PropertyRow label="두께">
            <input
              min="0"
              max="24"
              type="number"
              value={value.width}
              onChange={(event) =>
                changeBorder({ width: readNumberInput(event, value.width, 0) })
              }
            />
          </PropertyRow>
          <PropertyRow label="스타일">
            <select
              value={value.style}
              onChange={(event) => changeBorder({ style: event.target.value })}
            >
              {BORDER_STYLES.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </PropertyRow>
        </div>
      ) : null}
    </section>
  );
}
