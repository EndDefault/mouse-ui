import { PropertyRow } from "./PropertyRow.jsx";

const INPUT_TYPES = ["text", "email", "password", "number"];

export function InputPropertyGroup({ component, onChange }) {
  return (
    <section className="property-group">
      <h3>입력창</h3>
      <PropertyRow label="라벨">
        <input
          type="text"
          value={component.label}
          onChange={(event) => onChange({ label: event.target.value })}
        />
      </PropertyRow>
      <PropertyRow label="힌트">
        <input
          type="text"
          value={component.placeholder}
          onChange={(event) => onChange({ placeholder: event.target.value })}
        />
      </PropertyRow>
      <PropertyRow label="타입">
        <select
          value={component.inputType}
          onChange={(event) => onChange({ inputType: event.target.value })}
        >
          {INPUT_TYPES.map((inputType) => (
            <option key={inputType} value={inputType}>
              {inputType}
            </option>
          ))}
        </select>
      </PropertyRow>
    </section>
  );
}
