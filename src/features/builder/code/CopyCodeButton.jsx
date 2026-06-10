import { useEffect, useState } from "react";

const COPY_STATUS = {
  IDLE: "idle",
  COPIED: "copied",
  FAILED: "failed"
};

export function CopyCodeButton({ code }) {
  const [status, setStatus] = useState(COPY_STATUS.IDLE);
  const disabled = !code;

  useEffect(() => {
    if (status === COPY_STATUS.IDLE) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setStatus(COPY_STATUS.IDLE);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [status]);

  async function handleCopy() {
    if (!code) {
      return;
    }

    try {
      await copyText(code);
      setStatus(COPY_STATUS.COPIED);
    } catch {
      setStatus(COPY_STATUS.FAILED);
    }
  }

  const label =
    status === COPY_STATUS.COPIED
      ? "복사됨"
      : status === COPY_STATUS.FAILED
        ? "실패"
        : "복사";

  return (
    <button
      className="copy-code-button"
      type="button"
      disabled={disabled}
      onClick={handleCopy}
    >
      {label}
    </button>
  );
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.append(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}
