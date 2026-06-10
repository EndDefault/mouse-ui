import { BUILDER_PANEL_TABS } from "../workspace/workspaceSettings.js";
import { COMPONENT_TYPES } from "../model/componentTypes.js";
import { getSolidBackgroundColor } from "../model/styleValues.js";
import { AnimationEditor } from "./AnimationEditor.jsx";
import { EmptyInspector } from "./EmptyInspector.jsx";
import { BorderPropertyGroup } from "./fields/BorderPropertyGroup.jsx";
import { ColorPropertyGroup } from "./fields/ColorPropertyGroup.jsx";
import { GradientEditor } from "./GradientEditor.jsx";
import { ImagePropertyGroup } from "./fields/ImagePropertyGroup.jsx";
import { InputPropertyGroup } from "./fields/InputPropertyGroup.jsx";
import { OpacityProperty } from "./fields/OpacityProperty.jsx";
import { PositionPropertyGroup } from "./fields/PositionPropertyGroup.jsx";
import { RadiusProperty } from "./fields/RadiusProperty.jsx";
import { ShadowPropertyGroup } from "./fields/ShadowPropertyGroup.jsx";
import { SizePropertyGroup } from "./fields/SizePropertyGroup.jsx";
import { TextProperty } from "./fields/TextProperty.jsx";
import "./inspector.css";

export function InspectorPanel({
  component,
  panelTab = "all",
  animationPreview,
  onChangeComponent,
  onPlayEnterPreview,
  onToggleStatePreview
}) {
  if (!component) {
    return <EmptyInspector />;
  }

  const showAll = panelTab === "all";
  const showAdjust = showAll || panelTab === BUILDER_PANEL_TABS.ADJUST;
  const showStyle = showAll || panelTab === BUILDER_PANEL_TABS.STYLE;
  const showAnimation = showAll || panelTab === BUILDER_PANEL_TABS.ANIMATION;
  const canEditContent =
    component.type === COMPONENT_TYPES.BUTTON ||
    component.type === COMPONENT_TYPES.TEXT ||
    component.type === COMPONENT_TYPES.INPUT ||
    component.type === COMPONENT_TYPES.IMAGE;
  const hasBackgroundControl = Boolean(component.style.background);
  const hasRadiusControl = component.style.borderRadius != null;
  const hasTextColorControl = component.style.color != null;

  function updateComponent(patch) {
    onChangeComponent(component.id, patch);
  }

  function updateStyle(stylePatch) {
    updateComponent({ style: stylePatch });
  }

  function updateProps(propsPatch) {
    updateComponent({ props: propsPatch });
  }

  function updateInteractions(interactions) {
    updateComponent({ interactions });
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

      {showAdjust && canEditContent ? (
        <>
          {component.type === COMPONENT_TYPES.BUTTON ||
          component.type === COMPONENT_TYPES.TEXT ? (
            <TextProperty
              value={component.props.text}
              onChange={(text) => updateProps({ text })}
              fontSize={
                component.type === COMPONENT_TYPES.TEXT
                  ? component.style.fontSize
                  : null
              }
              onChangeFontSize={(fontSize) => updateStyle({ fontSize })}
            />
          ) : null}

          {component.type === COMPONENT_TYPES.INPUT ? (
            <InputPropertyGroup component={component} onChange={updateProps} />
          ) : null}

          {component.type === COMPONENT_TYPES.IMAGE ? (
            <ImagePropertyGroup component={component} onChange={updateProps} />
          ) : null}
        </>
      ) : null}

      {showAdjust ? (
        <>
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
        </>
      ) : null}

      {showStyle ? (
        <>
          {hasBackgroundControl || hasTextColorControl ? (
            <ColorPropertyGroup
              backgroundColor={getSolidBackgroundColor(component.style)}
              color={component.style.color}
              showBackgroundColor={hasBackgroundControl}
              showTextColor={hasTextColorControl}
              onChange={updateStyle}
            />
          ) : null}
          {hasBackgroundControl ? (
            <GradientEditor
              background={component.style.background}
              onChange={updateStyle}
            />
          ) : null}
          {hasRadiusControl ? (
            <RadiusProperty
              value={component.style.borderRadius}
              onChange={(borderRadius) => updateStyle({ borderRadius })}
            />
          ) : null}
          <OpacityProperty
            value={component.style.opacity}
            onChange={(opacity) => updateStyle({ opacity })}
          />
          <ShadowPropertyGroup
            shadow={component.style.shadow}
            onChange={updateStyle}
          />
          <BorderPropertyGroup
            border={component.style.border}
            onChange={updateStyle}
          />
        </>
      ) : null}

      {showAnimation ? (
        <AnimationEditor
          component={component}
          isStatePreviewActive={
            animationPreview?.activeStateIds.includes(component.id) ?? false
          }
          onChange={updateInteractions}
          onPlayEnterPreview={onPlayEnterPreview}
          onToggleStatePreview={onToggleStatePreview}
        />
      ) : null}
    </section>
  );
}
