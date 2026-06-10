import { DEFAULT_SHADOW } from "../../model/styleValues.js";
import { PropertyRow } from "./PropertyRow.jsx";
import { readNumberInput } from "./readNumberInput.js";

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
              <input
                min="-100"
                max="100"
                type="number"
                value={value.x}
                onChange={(event) =>
                  changeShadow({ x: readNumberInput(event, value.x, -100) })
                }
              />
            </PropertyRow>
            <PropertyRow label="Y">
              <input
                min="-100"
                max="100"
                type="number"
                value={value.y}
                onChange={(event) =>
                  changeShadow({ y: readNumberInput(event, value.y, -100) })
                }
              />
            </PropertyRow>
            <PropertyRow label="Blur">
              <input
                min="0"
                max="160"
                type="number"
                value={value.blur}
                onChange={(event) =>
                  changeShadow({
                    blur: readNumberInput(event, value.blur, 0)
                  })
                }
              />
            </PropertyRow>
            <PropertyRow label="Spread">
              <input
                min="-100"
                max="100"
                type="number"
                value={value.spread}
                onChange={(event) =>
                  changeShadow({
                    spread: readNumberInput(event, value.spread, -100)
                  })
                }
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
