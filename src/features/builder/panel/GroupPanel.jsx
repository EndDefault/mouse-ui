export function GroupPanel({
  components,
  selectedIds,
  onAlignHorizontal,
  onAlignVertical,
  onDistributeHorizontal,
  onDistributeVertical
}) {
  const selectedComponents = getSelectedComponents(components, selectedIds);
  const operationComponents = getSameParentComponents(selectedComponents);
  const selectedParentName = getParentName(components, operationComponents[0]);
  const canAlign = operationComponents.length >= 2;
  const canDistribute = operationComponents.length >= 3;

  return (
    <section className="group-panel">
      <div className="builder-inspector-header">
        <h2>그룹</h2>
        <span>{operationComponents.length}개</span>
      </div>

      <div className="group-summary">
        <strong>{selectedParentName}</strong>
        <span>같은 프레임 안에서 선택된 컴포넌트만 정렬됩니다.</span>
      </div>

      <div className="group-actions">
        <button type="button" onClick={onAlignHorizontal} disabled={!canAlign}>
          가로 정렬
        </button>
        <button type="button" onClick={onAlignVertical} disabled={!canAlign}>
          세로 정렬
        </button>
        <button
          type="button"
          onClick={onDistributeHorizontal}
          disabled={!canDistribute}
        >
          가로 간격
        </button>
        <button
          type="button"
          onClick={onDistributeVertical}
          disabled={!canDistribute}
        >
          세로 간격
        </button>
      </div>

      {operationComponents.length === 0 ? (
        <div className="empty-inspector">그룹으로 다룰 컴포넌트를 선택하세요.</div>
      ) : (
        <div className="group-component-list">
          {operationComponents.map((component) => (
            <div key={component.id} className="group-component-row">
              <strong>{component.name}</strong>
              <span>
                {component.id} · {component.width}x{component.height}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function getSelectedComponents(components, selectedIds) {
  const selectedIdSet = new Set(selectedIds);

  return components.filter(
    (component) => selectedIdSet.has(component.id) && !component.locked
  );
}

function getSameParentComponents(selectedComponents) {
  const parentId = selectedComponents[0]?.parentId ?? null;

  return selectedComponents.filter(
    (component) => (component.parentId ?? null) === parentId
  );
}

function getParentName(components, component) {
  if (!component?.parentId) {
    return "캔버스 프레임";
  }

  return (
    components.find((parentComponent) => parentComponent.id === component.parentId)
      ?.name ?? "상위 프레임"
  );
}
