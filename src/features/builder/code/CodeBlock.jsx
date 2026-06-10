export function CodeBlock({ code, selectedIds = [] }) {
  if (!code) {
    return <div className="code-empty">생성된 HTML 없음</div>;
  }
  const selectedIdSet = new Set(selectedIds);

  return (
    <pre className="code-block">
      <code>
        {code.split("\n").map((line, index) => {
          const isSelectedLine = [...selectedIdSet].some((id) =>
            line.includes(`data-mouse-ui-id="${id}"`)
          );

          return (
            <span
              key={`${index}-${line}`}
              className={isSelectedLine ? "code-line is-selected-code" : "code-line"}
            >
              {line}
              {"\n"}
            </span>
          );
        })}
      </code>
    </pre>
  );
}
