export function LockedComponentsPanel({ components, onUnlock }) {
  const lockedComponents = components.filter((component) => component.locked);

  return (
    <section className="locked-components-panel">
      <div className="builder-inspector-header">
        <h2>잠금 관리</h2>
        <span>{lockedComponents.length}개</span>
      </div>
      {lockedComponents.length === 0 ? (
        <div className="empty-inspector">고정된 컴포넌트가 없습니다.</div>
      ) : (
        <div className="locked-component-list">
          {lockedComponents.map((component) => (
            <div key={component.id} className="locked-component-row">
              <div>
                <strong>{component.name}</strong>
                <span>{component.id}</span>
              </div>
              <button type="button" onClick={() => onUnlock(component.id)}>
                해제
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
