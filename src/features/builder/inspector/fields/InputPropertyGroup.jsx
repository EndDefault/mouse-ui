import { PropertyRow } from "./PropertyRow.jsx";

const INPUT_TYPES = ["text", "email", "password", "number"];

export function InputPropertyGroup({ component, onChange }) {
  const { inputType, label, placeholder, showLabel = true } = component.props;

  return (
    <section className="property-group">
      <h3>입력창</h3>
      <PropertyRow label="라벨">
        <select
          value={showLabel ? "show" : "hide"}
          onChange={(event) =>
            onChange({ showLabel: event.target.value === "show" })
          }
        >
          <option value="show">표시</option>
          <option value="hide">숨김</option>
        </select>
      </PropertyRow>
      {showLabel ? (
        <PropertyRow label="라벨명">
          <input
            type="text"
            value={label}
            onChange={(event) => onChange({ label: event.target.value })}
          />
        </PropertyRow>
      ) : null}
      <PropertyRow label="힌트">
        <input
          type="text"
          value={placeholder}
          onChange={(event) => onChange({ placeholder: event.target.value })}
        />
      </PropertyRow>
      <PropertyRow label="타입">
        <select
          value={inputType}
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
