
// ---------- 4. Quick actions ----------
export default function QuickActions() {
  return (
    <section className="section-tight">
      <div className="container">
        <div className="panel" style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <p className="text-mid">Quick actions</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a href="/pages/tasks.html#add-task" className="btn btn-primary">+ Add task</a>
            <a href="/pages/schedule.html#add-event" className="btn">+ Add event</a>
          </div>
        </div>
      </div>
    </section>
  );
}
