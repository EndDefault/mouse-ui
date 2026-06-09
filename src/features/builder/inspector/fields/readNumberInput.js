export function readNumberInput(event, fallbackValue, minValue = 0) {
  if (event.target.value === "") {
    return fallbackValue;
  }

  const value = Number(event.target.value);

  if (!Number.isFinite(value)) {
    return fallbackValue;
  }

  return Math.max(minValue, Math.round(value));
}
