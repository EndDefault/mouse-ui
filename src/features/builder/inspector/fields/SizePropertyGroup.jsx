import { PropertyRow } from "./PropertyRow.jsx";
import { NumberInput } from "./NumberInput.jsx";

export function SizePropertyGroup({ width, height, onChange }) {
  return (
    <section className="property-group">
      <h3>크기</h3>
      <div className="property-grid">
        <PropertyRow label="W">
          <NumberInput
            min="64"
            value={width}
            onChange={(nextWidth) => onChange({ width: nextWidth })}
          />
        </PropertyRow>
        <PropertyRow label="H">
          <NumberInput
            min="32"
            value={height}
            onChange={(nextHeight) => onChange({ height: nextHeight })}
          />
        </PropertyRow>
      </div>
    </section>
  );
}
