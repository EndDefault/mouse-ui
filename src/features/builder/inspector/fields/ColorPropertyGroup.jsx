import { PropertyRow } from "./PropertyRow.jsx";

export function ColorPropertyGroup({ backgroundColor, color, onChange }) {
  return (
    <section className="property-group">
      <h3>색상</h3>
      <div className="property-grid">
        <PropertyRow label="배경">
          <input
            type="color"
            value={backgroundColor}
            onChange={(event) =>
              onChange({ backgroundColor: event.target.value })
            }
          />
        </PropertyRow>
        <PropertyRow label="글자">
          <input
            type="color"
            value={color}
            onChange={(event) => onChange({ color: event.target.value })}
          />
        </PropertyRow>
      </div>
    </section>
  );
}
