export function CodeBlock({ code }) {
  if (!code) {
    return <div className="code-empty">생성된 HTML 없음</div>;
  }

  return (
    <pre className="code-block">
      <code>{code}</code>
    </pre>
  );
}
