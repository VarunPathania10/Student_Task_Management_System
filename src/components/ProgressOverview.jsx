import { getHoursThisWeek } from "../lib/common";

// ---------- 6. Progress overview ----------
export default function ProgressOverview(props) {
  const hours = getHoursThisWeek();
  const goal = 18;
  const goalPercent = Math.min(100, Math.round((hours / goal) * 100));

  return (
    <section className="section-tight">
      <div className="container">
        <div className="section-heading"><h2>Progress overview</h2><a className="see-all" href="/pages/progress.html">Full report →</a></div>
        <div className="panel">
          <div className="progress-row"><span>Overall completion</span><span>{props.counts.percent}%</span></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: props.counts.percent + "%" }}></div></div>
          <div style={{ height: "18px" }}></div>
          <div className="progress-row"><span>Weekly study goal ({goal} hrs)</span><span>{hours} / {goal} hrs</span></div>
          <div className="progress-track"><div className="progress-fill fill-teal" style={{ width: goalPercent + "%" }}></div></div>
        </div>
      </div>
    </section>
  );
}
