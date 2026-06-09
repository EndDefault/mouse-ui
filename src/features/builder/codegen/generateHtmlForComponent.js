import { COMPONENT_TYPES } from "../model/componentTypes.js";
import { escapeHtml } from "./escapeHtml.js";

export function generateHtmlForComponent(component) {
  if (component.type === COMPONENT_TYPES.BUTTON) {
    return generateButtonHtml(component);
  }

  return "";
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
