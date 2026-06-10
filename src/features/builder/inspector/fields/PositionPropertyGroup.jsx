import { PropertyRow } from "./PropertyRow.jsx";
import { NumberInput } from "./NumberInput.jsx";

export function PositionPropertyGroup({ x, y, onChange }) {
  return (
    <section className="property-group">
      <h3>위치</h3>
      <div className="property-grid">
        <PropertyRow label="X">
          <NumberInput
            min="0"
            value={x}
            onChange={(nextX) => onChange({ x: nextX })}
          />
        </PropertyRow>
        <PropertyRow label="Y">
          <NumberInput
            min="0"
            value={y}
            onChange={(nextY) => onChange({ y: nextY })}
          />
        </PropertyRow>
      </div>
    </section>
  );
}
