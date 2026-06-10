import { DEFAULT_SHADOW } from "../../model/styleValues.js";
import { NumberInput } from "./NumberInput.jsx";
import { PropertyRow } from "./PropertyRow.jsx";

export function ShadowPropertyGroup({ shadow, onChange }) {
  const value = {
    ...DEFAULT_SHADOW,
    ...(shadow ?? {})
  };

  function changeShadow(shadowPatch) {
    onChange({
      shadow: {
        ...value,
        ...shadowPatch
      }
    });
  }

  return (
    <section className="property-group">
      <h3>그림자</h3>
      <label className="property-toggle">
        <input
          checked={value.enabled}
          type="checkbox"
          onChange={(event) => changeShadow({ enabled: event.target.checked })}
        />
        <span>그림자 사용</span>
      </label>
      {value.enabled ? (
        <>
          <div className="property-grid">
            <PropertyRow label="X">
              <NumberInput
                min="-100"
                max="100"
                value={value.x}
                onChange={(x) => changeShadow({ x })}
              />
            </PropertyRow>
            <PropertyRow label="Y">
              <NumberInput
                min="-100"
                max="100"
                value={value.y}
                onChange={(y) => changeShadow({ y })}
              />
            </PropertyRow>
            <PropertyRow label="Blur">
              <NumberInput
                min="0"
                max="160"
                value={value.blur}
                onChange={(blur) => changeShadow({ blur })}
              />
            </PropertyRow>
            <PropertyRow label="Spread">
              <NumberInput
                min="-100"
                max="100"
                value={value.spread}
                onChange={(spread) => changeShadow({ spread })}
              />
            </PropertyRow>
            <PropertyRow label="색상">
              <input
                type="color"
                value={value.color}
                onChange={(event) => changeShadow({ color: event.target.value })}
              />
            </PropertyRow>
          </div>
          <PropertyRow label={`투명도 ${Math.round(value.opacity * 100)}%`}>
            <input
              min="0"
              max="100"
              type="range"
              value={Math.round(value.opacity * 100)}
              onChange={(event) =>
                changeShadow({ opacity: Number(event.target.value) / 100 })
              }
            />
          </PropertyRow>
        </>
      ) : null}
    </section>
  );
}
