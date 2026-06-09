import { COMPONENT_TYPES } from "../model/componentTypes.js";
import { escapeHtml } from "./escapeHtml.js";

export function generateHtmlForComponent(component) {
  if (component.type === COMPONENT_TYPES.BUTTON) {
    return generateButtonHtml(component);
  }

  if (component.type === COMPONENT_TYPES.TEXT) {
    return generateTextHtml(component);
  }

  if (component.type === COMPONENT_TYPES.INPUT) {
    return generateInputHtml(component);
  }

  if (component.type === COMPONENT_TYPES.BOX) {
    return generateBoxHtml(component);
  }

  return "";
}

function generateBoxHtml(component) {
  const style = [
    "position:absolute",
    `left:${component.x}px`,
    `top:${component.y}px`,
    `width:${component.width}px`,
    `height:${component.height}px`,
    `background:${component.style.backgroundColor}`,
    `border-radius:${component.style.borderRadius}px`
  ].join("; ");

  return `  <div style="${style}"></div>`;
}

function generateInputHtml(component) {
  const wrapperStyle = [
    "position:absolute",
    `left:${component.x}px`,
    `top:${component.y}px`,
    `width:${component.width}px`,
    `height:${component.height}px`,
    `color:${component.style.color}`,
    "font:700 12px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ].join("; ");
  const inputStyle = [
    "display:block",
    "width:100%",
    "height:38px",
    "margin-top:6px",
    "padding:0 12px",
    `border-radius:${component.style.borderRadius}px`,
    "border:1px solid #d8cfc3",
    `background:${component.style.backgroundColor}`,
    `color:${component.style.color}`,
    "font:600 14px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ].join("; ");

  return [
    `  <label style="${wrapperStyle}">`,
    `    ${escapeHtml(component.label)}`,
    `    <input type="${escapeHtml(component.inputType)}" placeholder="${escapeHtml(component.placeholder)}" style="${inputStyle}" />`,
    "  </label>"
  ].join("\n");
}

function generateTextHtml(component) {
  const style = [
    "position:absolute",
    `left:${component.x}px`,
    `top:${component.y}px`,
    `width:${component.width}px`,
    `height:${component.height}px`,
    `margin:0`,
    `color:${component.style.color}`,
    `font-size:${component.style.fontSize}px`,
    "font-weight:700",
    "display:flex",
    "align-items:center"
  ].join("; ");

  return `  <p style="${style}">${escapeHtml(component.text)}</p>`;
}

function generateButtonHtml(component) {
  const style = [
    "position:absolute",
    `left:${component.x}px`,
    `top:${component.y}px`,
    `width:${component.width}px`,
    `height:${component.height}px`,
    `background:${component.style.backgroundColor}`,
    `color:${component.style.color}`,
    `border-radius:${component.style.borderRadius}px`,
    "border:0",
    "font:600 14px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    "cursor:pointer"
  ].join("; ");

  return `  <button style="${style}">\n    ${escapeHtml(component.text)}\n  </button>`;
}
