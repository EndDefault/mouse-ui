import { PropertyRow } from "./PropertyRow.jsx";
import { NumberInput } from "./NumberInput.jsx";

export function RadiusProperty({ value, onChange }) {
  return (
    <section className="property-group">
      <h3>모서리</h3>
      <PropertyRow label="둥글기">
        <NumberInput
          min="0"
          max="64"
          value={value}
          onChange={onChange}
        />
      </PropertyRow>
    </section>
  );
}
