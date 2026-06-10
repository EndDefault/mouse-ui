import { COMPONENT_TYPES } from "../model/componentTypes.js";
import { getBackgroundCss } from "../model/styleValues.js";
import { escapeHtml } from "./escapeHtml.js";
import { getAnimationClassName } from "./renderAnimations.js";

export function generateHtmlForComponent(component, components = [], depth = 1) {
  if (component.type === COMPONENT_TYPES.BUTTON) {
    return generateButtonHtml(component, depth);
  }

  if (component.type === COMPONENT_TYPES.TEXT) {
    return generateTextHtml(component, depth);
  }

  if (component.type === COMPONENT_TYPES.INPUT) {
    return generateInputHtml(component, depth);
  }

  if (component.type === COMPONENT_TYPES.CONTAINER) {
    return generateContainerHtml(component, components, depth);
  }

  if (component.type === COMPONENT_TYPES.IMAGE) {
    return generateImageHtml(component, depth);
  }

  return "";
}

function generateContainerHtml(component, components, depth) {
  const children = components
    .filter((child) => child.parentId === component.id)
    .map((child) => generateHtmlForComponent(child, components, depth + 1))
    .join("\n");
  const style = buildBaseStyle(component, [
    `background:${getBackgroundCss(component.style)}`,
    `color:${component.style.color}`,
    `border-radius:${component.style.borderRadius}px`,
    "overflow:hidden"
  ]);
  const indent = getIndent(depth);
  const closeIndent = children ? `\n${indent}` : "";

  return `${indent}<div ${renderAttributes(component, style)}>${children ? `\n${children}` : ""}${closeIndent}</div>`;
}

function generateImageHtml(component, depth) {
  const style = buildBaseStyle(component, [
    `background:${getBackgroundCss(component.style)}`,
    `border-radius:${component.style.borderRadius}px`,
    "object-fit:cover"
  ]);

  if (!component.props.src) {
    return `${getIndent(depth)}<div role="img" aria-label="${escapeHtml(component.props.alt)}" ${renderAttributes(component, style)}></div>`;
  }

  return `${getIndent(depth)}<img src="${escapeHtml(component.props.src)}" alt="${escapeHtml(component.props.alt)}" ${renderAttributes(component, style)} />`;
}

function generateInputHtml(component, depth) {
  const wrapperStyle = buildBaseStyle(component, [
    `color:${component.style.color}`,
    "font:700 12px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ]);
  const inputStyle = [
    "display:block",
    "width:100%",
    "height:38px",
    "margin-top:6px",
    "padding:0 12px",
    `border-radius:${component.style.borderRadius}px`,
    "border:1px solid #d8cfc3",
    `background:${getBackgroundCss(component.style)}`,
    `color:${component.style.color}`,
    "font:600 14px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ].join("; ");
  const indent = getIndent(depth);

  return [
    `${indent}<label ${renderAttributes(component, wrapperStyle)}>`,
    `${indent}  ${escapeHtml(component.props.label)}`,
    `${indent}  <input type="${escapeHtml(component.props.inputType)}" placeholder="${escapeHtml(component.props.placeholder)}" style="${inputStyle}" />`,
    `${indent}</label>`
  ].join("\n");
}

function generateTextHtml(component, depth) {
  const style = buildBaseStyle(component, [
    "margin:0",
    `color:${component.style.color}`,
    `font-size:${component.style.fontSize}px`,
    "font-weight:700",
    "display:flex",
    "align-items:center"
  ]);

  return `${getIndent(depth)}<p ${renderAttributes(component, style)}>${escapeHtml(component.props.text)}</p>`;
}

function generateButtonHtml(component, depth) {
  const style = buildBaseStyle(component, [
    `background:${getBackgroundCss(component.style)}`,
    `color:${component.style.color}`,
    `border-radius:${component.style.borderRadius}px`,
    "border:0",
    "font:600 14px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    "cursor:pointer"
  ]);

  return `${getIndent(depth)}<button ${renderAttributes(component, style)}>\n${getIndent(depth + 1)}${escapeHtml(component.props.text)}\n${getIndent(depth)}</button>`;
}

function buildBaseStyle(component, declarations = []) {
  return [
    "position:absolute",
    `left:${component.x}px`,
    `top:${component.y}px`,
    `width:${component.width}px`,
    `height:${component.height}px`,
    ...declarations
  ].join("; ");
}

function getIndent(depth) {
  return "  ".repeat(depth);
}

function renderAttributes(component, style) {
  const className = getAnimationClassName(component);
  const idAttribute = `data-mouse-ui-id="${escapeHtml(component.id)}"`;

  if (!className) {
    return `${idAttribute} style="${style}"`;
  }

  return `${idAttribute} class="${className}" style="${style}"`;
}
