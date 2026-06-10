export function AppLayout({ topBar, toolbar, canvas, sidePanel }) {
  const workspaceClassName = [
    "app-workspace",
    toolbar ? "has-toolbar" : "",
    sidePanel ? "has-side-panel" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="app-shell">
      <header className="app-header">{topBar}</header>
      <main className={workspaceClassName}>
        {toolbar ? <aside className="app-toolbar">{toolbar}</aside> : null}
        <section className="app-canvas">{canvas}</section>
        {sidePanel ? <aside className="app-side-panel">{sidePanel}</aside> : null}
      </main>
    </div>
  );
}
