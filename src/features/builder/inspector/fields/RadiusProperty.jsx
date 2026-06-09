import { PropertyRow } from "./PropertyRow.jsx";
import { readNumberInput } from "./readNumberInput.js";

export function RadiusProperty({ value, onChange }) {
  return (
    <section className="property-group">
      <h3>모양</h3>
      <PropertyRow label="둥글기">
        <input
          min="0"
          max="64"
          type="number"
          value={value}
          onChange={(event) => onChange(readNumberInput(event, value, 0))}
        />
      </PropertyRow>
    </section>
  );
}
