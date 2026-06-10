import { PropertyRow } from "./PropertyRow.jsx";

export function TextProperty({ value, onChange }) {
  return (
    <section className="property-group">
      <h3>콘텐츠</h3>
      <PropertyRow label="텍스트">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </PropertyRow>
    </section>
  );
}
