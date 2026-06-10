import { generateHtmlForComponent } from "./generateHtmlForComponent.js";

export function generateHtml(project) {
  if (project.components.length === 0) {
    return "";
  }

  const children = project.components
    .filter((component) => !component.parentId)
    .map((component) => generateHtmlForComponent(component, project.components, 1))
    .join("\n");
  const style = [
    "position:relative",
    `width:${project.canvas.width}px`,
    `height:${project.canvas.height}px`,
    "overflow:hidden"
  ].join("; ");

  return `<div style="${style}">\n${children}\n</div>`;
}
