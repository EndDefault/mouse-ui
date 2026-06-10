export function AppLayout({ topBar, toolbar, canvas, sidePanel }) {
  const workspaceClassName = [
    "app-workspace",
    sidePanel ? "has-side-panel" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="app-shell">
      <header className="app-header">{topBar}</header>
      <main className={workspaceClassName}>
        <aside className="app-toolbar">{toolbar}</aside>
        <section className="app-canvas">{canvas}</section>
        {sidePanel ? <aside className="app-side-panel">{sidePanel}</aside> : null}
      </main>
    </div>
  );
}
