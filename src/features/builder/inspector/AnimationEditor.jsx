import { NumberInput } from "./fields/NumberInput.jsx";
import { PropertyRow } from "./fields/PropertyRow.jsx";

const EVENTS = [
  { value: "hover", label: "hover" },
  { value: "click", label: "클릭" },
  { value: "enter", label: "페이지 진입" },
  { value: "stateChange", label: "상태 변경" }
];

const ANIMATIONS = [
  { value: "move", label: "이동" },
  { value: "color", label: "색상 변경" },
  { value: "flyOut", label: "날아가기" },
  { value: "scale", label: "크기 변경" },
  { value: "opacity", label: "투명도 변경" }
];

const EASINGS = ["ease", "ease-in", "ease-out", "ease-in-out", "linear"];

export function AnimationEditor({
  component,
  isStatePreviewActive = false,
  onChange,
  onPlayEnterPreview,
  onToggleStatePreview
}) {
  const interaction = component.interactions[0] ?? createDefaultInteraction(component.id);
  const animation = interaction.animation;
  const isEnabled = component.interactions.length > 0;

  function changeEnabled(event) {
    onChange(event.target.checked ? [interaction] : []);
  }

  function changeInteraction(patch) {
    onChange([
      {
        ...interaction,
        ...patch
      }
    ]);
  }

  function changeAnimation(animationPatch) {
    changeInteraction({
      animation: {
        ...animation,
        ...animationPatch
      }
    });
  }

  function changeTo(toPatch) {
    changeAnimation({
      to: {
        ...animation.to,
        ...toPatch
      }
    });
  }

  return (
    <section className="property-group animation-editor">
      <h3>애니메이션</h3>
      <label className="animation-toggle">
        <input type="checkbox" checked={isEnabled} onChange={changeEnabled} />
        <span>사용</span>
      </label>
      {isEnabled ? (
        <>
          <PropertyRow label="이벤트">
            <select
              value={interaction.event}
              onChange={(event) =>
                changeInteraction({ event: event.target.value })
              }
            >
              {EVENTS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </PropertyRow>
          <PropertyRow label="효과">
            <select
              value={animation.type}
              onChange={(event) =>
                changeAnimation({
                  type: event.target.value,
                  to: getDefaultTo(event.target.value)
                })
              }
            >
              {ANIMATIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </PropertyRow>
          <div className="animation-grid">
            <PropertyRow label="시간">
              <NumberInput
                min="0"
                value={animation.duration}
                onChange={(duration) => changeAnimation({ duration })}
              />
            </PropertyRow>
            <PropertyRow label="가속">
              <select
                value={animation.easing}
                onChange={(event) =>
                  changeAnimation({ easing: event.target.value })
                }
              >
                {EASINGS.map((easing) => (
                  <option key={easing} value={easing}>
                    {easing}
                  </option>
                ))}
              </select>
            </PropertyRow>
          </div>
          <AnimationTargetFields animation={animation} onChange={changeTo} />
          <div className="animation-preview-actions">
            <button
              type="button"
              onClick={() => onPlayEnterPreview(component.id)}
            >
              진입 재생
            </button>
            <button
              type="button"
              aria-pressed={isStatePreviewActive}
              onClick={() => onToggleStatePreview(component.id)}
            >
              {isStatePreviewActive ? "상태 끄기" : "상태 켜기"}
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}

function AnimationTargetFields({ animation, onChange }) {
  if (animation.type === "move" || animation.type === "flyOut") {
    return (
      <div className="animation-grid">
        <PropertyRow label="X">
          <NumberInput
            min="-10000"
            value={animation.to.x ?? 20}
            onChange={(x) => onChange({ x })}
          />
        </PropertyRow>
        <PropertyRow label="Y">
          <NumberInput
            min="-10000"
            value={animation.to.y ?? 0}
            onChange={(y) => onChange({ y })}
          />
        </PropertyRow>
      </div>
    );
  }

  if (animation.type === "color") {
    return (
      <PropertyRow label="색상">
        <input
          type="color"
          value={animation.to.color ?? "#f06f47"}
          onChange={(event) => onChange({ color: event.target.value })}
        />
      </PropertyRow>
    );
  }

  if (animation.type === "scale") {
    return (
      <PropertyRow label="배율">
        <NumberInput
          min="0.1"
          step="0.1"
          value={animation.to.scale ?? 1.08}
          onChange={(scale) => onChange({ scale })}
        />
      </PropertyRow>
    );
  }

  return (
    <PropertyRow label="투명도">
      <NumberInput
        max="1"
        min="0"
        step="0.1"
        value={animation.to.opacity ?? 0.35}
        onChange={(opacity) => onChange({ opacity })}
      />
    </PropertyRow>
  );
}

function createDefaultInteraction(componentId) {
  return {
    id: `${componentId}-interaction-1`,
    event: "hover",
    animation: {
      type: "move",
      to: getDefaultTo("move"),
      duration: 300,
      easing: "ease"
    }
  };
}

function getDefaultTo(type) {
  if (type === "move") {
    return { x: 20, y: 0 };
  }

  if (type === "color") {
    return { color: "#f06f47" };
  }

  if (type === "flyOut") {
    return { x: 80, y: -20 };
  }

  if (type === "scale") {
    return { scale: 1.08 };
  }

  return { opacity: 0.35 };
}
