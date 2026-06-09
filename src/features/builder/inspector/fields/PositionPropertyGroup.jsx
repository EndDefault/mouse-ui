import { PropertyRow } from "./PropertyRow.jsx";
import { readNumberInput } from "./readNumberInput.js";

export function PositionPropertyGroup({ x, y, onChange }) {
  return (
    <section className="property-group">
      <h3>위치</h3>
      <div className="property-grid">
        <PropertyRow label="X">
          <input
            min="0"
            type="number"
            value={x}
            onChange={(event) => onChange({ x: readNumberInput(event, x) })}
          />
        </PropertyRow>
        <PropertyRow label="Y">
          <input
            min="0"
            type="number"
            value={y}
            onChange={(event) => onChange({ y: readNumberInput(event, y) })}
          />
        </PropertyRow>
      </div>
    </section>
  );
}
