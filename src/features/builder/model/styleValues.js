export const DEFAULT_SHADOW = {
  enabled: false,
  x: 0,
  y: 8,
  blur: 18,
  spread: 0,
  color: "#000000",
  opacity: 0.18
};

export const DEFAULT_BORDER = {
  enabled: false,
  color: "#d8cfc3",
  width: 1,
  style: "solid"
};

export function getBackgroundCss(style) {
  const background = style?.background;

  if (background?.type === "gradient" && background.gradient) {
    const {
      direction,
      from,
      to,
      fromPosition = 0,
      toPosition = 100
    } = background.gradient;

    return `linear-gradient(${direction}, ${from} ${fromPosition}%, ${to} ${toPosition}%)`;
  }

  return background?.color ?? style?.backgroundColor ?? "transparent";
}

export function getSolidBackgroundColor(style, fallbackColor = "#ffffff") {
  return style?.background?.color ?? style?.backgroundColor ?? fallbackColor;
}

export function getCanvasVisualStyle(style) {
  return {
    opacity: readOpacity(style?.opacity),
    boxShadow: getShadowCss(style),
    border: getBorderCss(style)
  };
}

export function getVisualStyleDeclarations(style) {
  return [
    `opacity:${readOpacity(style?.opacity)}`,
    `box-shadow:${getShadowCss(style)}`,
    `border:${getBorderCss(style)}`
  ];
}

export function getShadowCss(style) {
  const shadow = {
    ...DEFAULT_SHADOW,
    ...(style?.shadow ?? {})
  };

  if (!shadow.enabled) {
    return "none";
  }

  return `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${hexToRgba(
    shadow.color,
    shadow.opacity
  )}`;
}

export function getBorderCss(style) {
  const border = {
    ...DEFAULT_BORDER,
    ...(style?.border ?? {})
  };

  if (!border.enabled) {
    return "0";
  }

  return `${border.width}px ${border.style} ${border.color}`;
}

function readOpacity(value) {
  const opacity = Number(value);

  if (!Number.isFinite(opacity)) {
    return 1;
  }

  return Math.min(1, Math.max(0, Math.round(opacity * 100) / 100));
}

function hexToRgba(hexColor, opacity) {
  const normalized = typeof hexColor === "string" ? hexColor.replace("#", "") : "";
  const safeHex = /^[0-9a-fA-F]{6}$/.test(normalized) ? normalized : "000000";
  const alpha = readOpacity(opacity);
  const red = parseInt(safeHex.slice(0, 2), 16);
  const green = parseInt(safeHex.slice(2, 4), 16);
  const blue = parseInt(safeHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
