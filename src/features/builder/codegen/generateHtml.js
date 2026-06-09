import { generateHtmlForComponent } from "./generateHtmlForComponent.js";

export function generateHtml(components) {
  if (components.length === 0) {
    return "";
  }

  const children = components.map(generateHtmlForComponent).join("\n");

  return `<div style="position:relative; width:720px; height:480px;">\n${children}\n</div>`;
}
