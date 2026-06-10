import { useEffect, useState } from "react";

export function NumberInput({ value, min, max, step, onChange }) {
  const [draftValue, setDraftValue] = useState(String(value));

  useEffect(() => {
    setDraftValue(String(value));
  }, [value]);

  function handleChange(event) {
    const nextValue = event.target.value;

    setDraftValue(nextValue);

    if (nextValue === "" || nextValue === "-" || nextValue === ".") {
      return;
    }

    const number = Number(nextValue);

    if (
      Number.isFinite(number) &&
      (!Number.isFinite(Number(min)) || number >= Number(min))
    ) {
      onChange(formatNumber(number, step));
    }
  }

  function handleBlur() {
    const number = Number(draftValue);

    if (!Number.isFinite(number)) {
      setDraftValue(String(value));
      return;
    }

    const nextValue = clampNumber(formatNumber(number, step), min, max);

    setDraftValue(String(nextValue));
    onChange(nextValue);
  }

  return (
    <input
      max={max}
      min={min}
      step={step}
      type="number"
      value={draftValue}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
}

function formatNumber(value, step) {
  if (String(step ?? "").includes(".")) {
    return Math.round(value * 100) / 100;
  }

  return Math.round(value);
}

function clampNumber(value, min, max) {
  let nextValue = value;

  if (Number.isFinite(Number(min))) {
    nextValue = Math.max(Number(min), nextValue);
  }

  if (Number.isFinite(Number(max))) {
    nextValue = Math.min(Number(max), nextValue);
  }

  return nextValue;
}
