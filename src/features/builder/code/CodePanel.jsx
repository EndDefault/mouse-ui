import { CodeBlock } from "./CodeBlock.jsx";
import { CopyCodeButton } from "./CopyCodeButton.jsx";

export function CodePanel({ code, componentCount, selectedIds = [] }) {
  return (
    <div className="builder-code-panel">
      <div className="builder-code-header">
        <h2>HTML</h2>
        <div className="builder-code-actions">
          <span>{componentCount}개 요소</span>
          <CopyCodeButton code={code} />
        </div>
      </div>
      <CodeBlock code={code} selectedIds={selectedIds} />
    </div>
  );
}
