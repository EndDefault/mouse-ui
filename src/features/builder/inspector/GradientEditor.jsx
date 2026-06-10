import { PropertyRow } from "./fields/PropertyRow.jsx";
import { readNumberInput } from "./fields/readNumberInput.js";

const DIRECTIONS = [
  { value: "to right", label: "오른쪽" },
  { value: "to left", label: "왼쪽" },
  { value: "to bottom", label: "아래" },
  { value: "to top", label: "위" },
  { value: "135deg", label: "대각선" }
];

export function GradientEditor({ background, onChange }) {
  const gradient = {
    kind: "linear",
    direction: "to right",
    from: background.color ?? "#2563eb",
    to: "#14b8a6",
    fromPosition: 0,
    toPosition: 100,
    ...(background.gradient ?? {})
  };

  function changeMode(type) {
    if (type === "solid") {
      onChange({
        background: {
          type: "solid",
          color: background.color,
          gradient: null
        }
      });
      return;
    }

    onChange({
      background: {
        type: "gradient",
        color: background.color,
        gradient
      }
    });
  }

  function changeGradient(gradientPatch) {
    onChange({
      background: {
        type: "gradient",
        color: background.color,
        gradient: {
          ...gradient,
          ...gradientPatch
        }
      }
    });
  }

  return (
    <section className="property-group gradient-editor">
      <h3>그라데이션</h3>
      <PropertyRow label="모드">
        <select
          value={background.type}
          onChange={(event) => changeMode(event.target.value)}
        >
          <option value="solid">단색</option>
          <option value="gradient">그라데이션</option>
        </select>
      </PropertyRow>
      {background.type === "gradient" ? (
        <>
          <div className="property-grid">
            <PropertyRow label="종류">
              <select
                value={gradient.kind}
                onChange={(event) =>
                  changeGradient({ kind: event.target.value })
                }
              >
                <option value="linear">선형</option>
              </select>
            </PropertyRow>
            <PropertyRow label="방향">
              <select
                value={gradient.direction}
                onChange={(event) =>
                  changeGradient({ direction: event.target.value })
                }
              >
                {DIRECTIONS.map((direction) => (
                  <option key={direction.value} value={direction.value}>
                    {direction.label}
                  </option>
                ))}
              </select>
            </PropertyRow>
          </div>
          <div className="gradient-color-row">
            <PropertyRow label="시작">
              <input
                type="color"
                value={gradient.from}
                onChange={(event) =>
                  changeGradient({ from: event.target.value })
                }
              />
            </PropertyRow>
            <PropertyRow label="끝">
              <input
                type="color"
                value={gradient.to}
                onChange={(event) => changeGradient({ to: event.target.value })}
              />
            </PropertyRow>
          </div>
          <div className="gradient-position-row">
            <PropertyRow label={`시작 위치 ${gradient.fromPosition}%`}>
              <input
                min="0"
                max="100"
                type="range"
                value={gradient.fromPosition}
                onChange={(event) =>
                  changeGradient({
                    fromPosition: Math.min(
                      gradient.toPosition,
                      readNumberInput(event, gradient.fromPosition, 0)
                    )
                  })
                }
              />
            </PropertyRow>
            <PropertyRow label={`끝 위치 ${gradient.toPosition}%`}>
              <input
                min="0"
                max="100"
                type="range"
                value={gradient.toPosition}
                onChange={(event) =>
                  changeGradient({
                    toPosition: Math.max(
                      gradient.fromPosition,
                      readNumberInput(event, gradient.toPosition, 0)
                    )
                  })
                }
              />
            </PropertyRow>
          </div>
        </>
      ) : null}
    </section>
  );
}
