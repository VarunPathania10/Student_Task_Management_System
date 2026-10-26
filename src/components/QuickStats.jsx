
// ---------- 3. Quick statistics ----------
export default function QuickStats(props) {
  const counts = props.counts;
  return (
    <section className="section-tight">
      <div className="container">
        <div className="section-heading"><h2>Quick statistics</h2></div>
        <div className="grid grid-4">
          <div className="stat-card"><span className="stat-num">{counts.total}</span><span className="stat-label">Total tasks</span></div>
          <div className="stat-card"><span className="stat-num accent-teal">{counts.done}</span><span className="stat-label">Completed</span></div>
          <div className="stat-card"><span className="stat-num accent-gold">{counts.pending}</span><span className="stat-label">Pending</span></div>
          <div className="stat-card"><span className="stat-num accent-rose">{counts.overdue}</span><span className="stat-label">Overdue</span></div>
        </div>
      </div>
    </section>
  );
}
