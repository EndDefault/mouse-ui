export function getBackgroundCss(style) {
  const background = style?.background;

  if (background?.type === "gradient" && background.gradient) {
    const { direction, from, to } = background.gradient;

    return `linear-gradient(${direction}, ${from}, ${to})`;
  }

  return background?.color ?? style?.backgroundColor ?? "transparent";
}

export function getSolidBackgroundColor(style, fallbackColor = "#ffffff") {
  return style?.background?.color ?? style?.backgroundColor ?? fallbackColor;
}
