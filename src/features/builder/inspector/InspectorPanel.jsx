import { COMPONENT_TYPES } from "../model/componentTypes.js";
import { EmptyInspector } from "./EmptyInspector.jsx";
import { ColorPropertyGroup } from "./fields/ColorPropertyGroup.jsx";
import { PositionPropertyGroup } from "./fields/PositionPropertyGroup.jsx";
import { RadiusProperty } from "./fields/RadiusProperty.jsx";
import { SizePropertyGroup } from "./fields/SizePropertyGroup.jsx";
import { TextProperty } from "./fields/TextProperty.jsx";
import "./inspector.css";

export function InspectorPanel({ component, onChangeComponent }) {
  if (!component) {
    return <EmptyInspector />;
  }

  function updateComponent(patch) {
    onChangeComponent(component.id, patch);
  }

  function updateStyle(stylePatch) {
    updateComponent({ style: stylePatch });
  }

  return (
    <section className="builder-inspector">
      <div className="builder-inspector-header">
        <h2>속성</h2>
        <span>{component.id}</span>
      </div>

      <dl className="component-summary">
        <div>
          <dt>유형</dt>
          <dd>{component.type}</dd>
        </div>
        <div>
          <dt>크기</dt>
          <dd>
            {component.width} x {component.height}
          </dd>
        </div>
      </dl>

      {component.type === COMPONENT_TYPES.BUTTON ||
      component.type === COMPONENT_TYPES.TEXT ? (
        <TextProperty
          value={component.text}
          onChange={(text) => updateComponent({ text })}
        />
      ) : null}

      <PositionPropertyGroup
        x={component.x}
        y={component.y}
        onChange={updateComponent}
      />
      <SizePropertyGroup
        width={component.width}
        height={component.height}
        onChange={updateComponent}
      />
      {component.style.backgroundColor && component.style.borderRadius != null ? (
        <>
          <ColorPropertyGroup
            backgroundColor={component.style.backgroundColor}
            color={component.style.color}
            onChange={updateStyle}
          />
          <RadiusProperty
            value={component.style.borderRadius}
            onChange={(borderRadius) => updateStyle({ borderRadius })}
          />
        </>
      ) : null}
    </section>
  );
}
