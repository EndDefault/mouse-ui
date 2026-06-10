import { PropertyRow } from "./PropertyRow.jsx";

export function TextProperty({ value, fontSize, onChange, onChangeFontSize }) {
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
      {fontSize != null && onChangeFontSize ? (
        <PropertyRow label={`글자 크기 ${fontSize}px`}>
          <input
            min="8"
            max="96"
            type="range"
            value={fontSize}
            onChange={(event) => onChangeFontSize(Number(event.target.value))}
          />
        </PropertyRow>
      ) : null}
    </section>
  );
}
