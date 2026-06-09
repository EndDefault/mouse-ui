export function AppLayout({ topBar, toolbar, canvas, sidePanel }) {
  return (
    <div className="app-shell">
      <header className="app-header">{topBar}</header>
      <main className="app-workspace">
        <aside className="app-toolbar">{toolbar}</aside>
        <section className="app-canvas">{canvas}</section>
        <aside className="app-side-panel">{sidePanel}</aside>
      </main>
    </div>
  );
}
