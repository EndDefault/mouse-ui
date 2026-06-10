import { PropertyRow } from "./PropertyRow.jsx";

export function OpacityProperty({ value = 1, onChange }) {
  const percent = Math.round(Number(value ?? 1) * 100);

  return (
    <section className="property-group">
      <h3>투명도</h3>
      <PropertyRow label={`${percent}%`}>
        <input
          min="0"
          max="100"
          type="range"
          value={percent}
          onChange={(event) => onChange(Number(event.target.value) / 100)}
        />
      </PropertyRow>
    </section>
  );
}
