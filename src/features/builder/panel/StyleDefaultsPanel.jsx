export function StyleDefaultsPanel({
  selectedComponent,
  styleDefaults,
  onChangeColor,
  onApplyToSelected,
  onReset
}) {
  const canUseSelected = Boolean(selectedComponent);
  const color = styleDefaults?.color ?? "#2f9e8f";

  return (
    <section className="style-defaults-panel">
      <div className="builder-inspector-header">
        <h2>기준 스타일</h2>
        <span>{color}</span>
      </div>
      <label className="style-default-color">
        <span>생성 색상</span>
        <input
          type="color"
          value={color}
          onChange={(event) => onChangeColor(event.target.value)}
        />
      </label>
      <div className="style-default-actions">
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
        <div className="style-default-row">
          <strong>새 컴포넌트 색상</strong>
          <span>배경이 있는 컴포넌트는 배경색, 텍스트는 글자색으로 적용됩니다.</span>
        </div>
      </div>
    </section>
  );
}
