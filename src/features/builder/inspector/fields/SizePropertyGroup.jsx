import { PropertyRow } from "./PropertyRow.jsx";
import { readNumberInput } from "./readNumberInput.js";

export function SizePropertyGroup({ width, height, onChange }) {
  return (
    <section className="property-group">
      <h3>크기</h3>
      <div className="property-grid">
        <PropertyRow label="W">
          <input
            min="64"
            type="number"
            value={width}
            onChange={(event) =>
              onChange({ width: readNumberInput(event, width, 64) })
            }
          />
        </PropertyRow>
        <PropertyRow label="H">
          <input
            min="32"
            type="number"
            value={height}
            onChange={(event) =>
              onChange({ height: readNumberInput(event, height, 32) })
            }
          />
        </PropertyRow>
      </div>
    </section>
  );
}
