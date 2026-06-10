export function renderAnimations(components) {
  return components.flatMap(renderComponentAnimations).join("\n\n");
}

export function getAnimationClassName(component) {
  if (!component.interactions.length) {
    return "";
  }

  return `mui-${component.id.replace(/[^a-z0-9_-]/gi, "-")}`;
}

function renderComponentAnimations(component) {
  const className = getAnimationClassName(component);

  if (!className) {
    return [];
  }

  return component.interactions.map((interaction, index) =>
    renderInteractionCss(className, interaction, index)
  );
}

function renderInteractionCss(className, interaction, index) {
  const animation = interaction.animation;
  const transition = `transition: all ${animation.duration}ms ${animation.easing};`;
  const declarations = renderAnimationDeclarations(animation);

  if (interaction.event === "enter") {
    const keyframesName = `${className}-enter-${index + 1}`;

    return [
      `.${className} { animation: ${keyframesName} ${animation.duration}ms ${animation.easing} both; }`,
      `@keyframes ${keyframesName} {`,
      "  from { opacity: 0; transform: translateY(8px); }",
      `  to { ${declarations} }`,
      "}"
    ].join("\n");
  }

  if (interaction.event === "click") {
    return `.${className}:active { ${transition} ${declarations} }`;
  }

  if (interaction.event === "stateChange") {
    return `.${className}.is-active { ${transition} ${declarations} }`;
  }

  return `.${className}:hover { ${transition} ${declarations} }`;
}

function renderAnimationDeclarations(animation) {
  const to = animation.to ?? {};

  if (animation.type === "move") {
    return `transform: translate(${to.x ?? 20}px, ${to.y ?? 0}px);`;
  }

  if (animation.type === "color") {
    return `background: ${to.color ?? "#f06f47"};`;
  }

  if (animation.type === "flyOut") {
    return `transform: translate(${to.x ?? 80}px, ${to.y ?? -20}px); opacity: 0;`;
  }

  if (animation.type === "scale") {
    return `transform: scale(${to.scale ?? 1.08});`;
  }

  return `opacity: ${to.opacity ?? 0.35};`;
}
