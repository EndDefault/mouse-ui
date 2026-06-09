import { CodeBlock } from "./CodeBlock.jsx";

export function CodePanel({ code, componentCount }) {
  return (
    <div className="builder-code-panel">
      <div className="builder-code-header">
        <h2>HTML</h2>
        <span>{componentCount}개 요소</span>
      </div>
      <CodeBlock code={code} />
    </div>
  );
}
