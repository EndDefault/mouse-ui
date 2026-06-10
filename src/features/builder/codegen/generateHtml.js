import { generateHtmlForComponent } from "./generateHtmlForComponent.js";
import { renderAnimations } from "./renderAnimations.js";

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
  const animations = renderAnimations(project.components);
  const animationStyle = animations ? `<style>\n${animations}\n</style>\n` : "";

  return `${animationStyle}<div style="${style}">\n${children}\n</div>`;
}
