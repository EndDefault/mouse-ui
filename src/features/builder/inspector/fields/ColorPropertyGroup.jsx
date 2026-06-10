import { PropertyRow } from "./PropertyRow.jsx";

export function ColorPropertyGroup({
  backgroundColor,
  color,
  showBackgroundColor = true,
  showTextColor = true,
  onChange
}) {
  if (!showBackgroundColor && !showTextColor) {
    return null;
  }

  return (
    <section className="property-group">
      <h3>색상</h3>
      <div className="property-grid">
        {showBackgroundColor ? (
          <PropertyRow label="배경">
            <input
              type="color"
              value={backgroundColor}
              onChange={(event) =>
                onChange({
                  background: {
                    type: "solid",
                    color: event.target.value,
                    gradient: null
                  }
                })
              }
            />
          </PropertyRow>
        ) : null}
        {showTextColor ? (
          <PropertyRow label="글자">
            <input
              type="color"
              value={color}
              onChange={(event) => onChange({ color: event.target.value })}
            />
          </PropertyRow>
        ) : null}
      </div>
    </section>
  );
}
