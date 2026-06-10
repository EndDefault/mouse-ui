const TYPE_LABELS = {
  button: "버튼",
  text: "텍스트",
  input: "입력창",
  container: "컨테이너",
  divBox: "div 박스"
};

export function StyleDefaultsPanel({
  selectedComponent,
  styleDefaults,
  onRegisterSelected,
  onApplyToSelected,
  onReset
}) {
  const canUseSelected = Boolean(selectedComponent);

  return (
    <section className="style-defaults-panel">
      <div className="builder-inspector-header">
        <h2>기준 스타일</h2>
        <span>{canUseSelected ? selectedComponent.type : "선택 없음"}</span>
      </div>
      <div className="style-default-actions">
        <button
          type="button"
          disabled={!canUseSelected}
          onClick={onRegisterSelected}
        >
          선택 요소를 기준으로 등록
        </button>
        <button
          type="button"
          disabled={!canUseSelected}
          onClick={onApplyToSelected}
        >
          선택 요소에 기준 적용
        </button>
        <button type="button" onClick={onReset}>
          기준 초기화
        </button>
      </div>
      <div className="style-default-list">
        {Object.entries(styleDefaults).map(([type, defaults]) => (
          <div key={type} className="style-default-row">
            <strong>{TYPE_LABELS[type] ?? type}</strong>
            <span>{summarizeStyle(defaults.style)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function summarizeStyle(style) {
  const parts = [];

  if (style.background?.color) {
    parts.push(style.background.color);
  }

  if (style.color) {
    parts.push(`text ${style.color}`);
  }

  if (style.fontSize) {
    parts.push(`${style.fontSize}px`);
  }

  if (style.borderRadius != null) {
    parts.push(`radius ${style.borderRadius}`);
  }

  return parts.join(" / ") || "기본값";
}
