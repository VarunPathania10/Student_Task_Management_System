import { getInitials, getProductivityScore, getStreak } from "../lib/common";

// ---------- 2. Profile card + productivity score ----------
export default function ProfileSection(props) {
  const score = getProductivityScore();
  const streak = getStreak();

  let scoreNote = "Finish a few tasks to raise your score";
  if (score >= 80) {
    scoreNote = "Excellent work, keep it up!";
  } else if (score >= 50) {
    scoreNote = "Good progress, keep going";
  }

  return (
    <section className="section-tight" id="dashboard">
      <div className="container grid grid-2" style={{ alignItems: "stretch" }}>
        <div className="profile-card">
          <div className="avatar">{getInitials(props.user.name)}</div>
          <div className="profile-meta">
            <h3>{props.user.name}</h3>
            <p className="text-dim">{props.user.guest ? "Guest account · data is saved in this browser" : "Student · " + props.user.email}</p>
            <p className="text-dim">Study streak: <span className="accent-gold">{streak} {streak === 1 ? "day" : "days"} 🔥</span></p>
          </div>
        </div>

        <div className="panel" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
          <div>
            <p className="text-dim" style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Productivity score</p>
            <p className="stat-num accent-teal">{score}<span style={{ fontSize: "1rem", color: "var(--text-dim)" }}>/100</span></p>
            <p className="text-dim" style={{ fontSize: "0.85rem" }}>{scoreNote}</p>
          </div>
          <div className="ring-wrap">
            <div className="ring" style={{ "--pct": score }}>
              <div className="ring-inner"><strong>{score}%</strong><span>on track</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
