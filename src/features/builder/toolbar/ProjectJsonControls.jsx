import { useRef, useState } from "react";
import {
  parseProjectJson,
  serializeProject
} from "../storage/projectSerializer.js";

export function ProjectJsonControls({ project, onImportProject }) {
  const [status, setStatus] = useState("");
  const fileInputRef = useRef(null);

  function handleExport() {
    const blob = new Blob([serializeProject(project)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "mouse-ui-project.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("JSON 저장됨");
  }

  async function handleImport(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const nextProject = parseProjectJson(await file.text());
      onImportProject(nextProject);
      setStatus("JSON 불러옴");
    } catch {
      setStatus("JSON 오류");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="project-json-controls">
      <h2>프로젝트</h2>
      <button type="button" onClick={handleExport}>
        JSON 저장
      </button>
      <button type="button" onClick={() => fileInputRef.current?.click()}>
        JSON 불러오기
      </button>
      <input
        ref={fileInputRef}
        accept="application/json,.json"
        type="file"
        onChange={handleImport}
      />
      {status ? <span>{status}</span> : null}
    </div>
  );
}
