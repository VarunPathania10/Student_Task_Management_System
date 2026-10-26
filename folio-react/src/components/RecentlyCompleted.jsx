import { completedText } from "../lib/common";

// ---------- 7a. Recently completed ----------
export default function RecentlyCompleted(props) {
  const finished = props.tasks
    .filter(function (task) { return task.done && !task.archived; })
    .sort(function (a, b) { return (a.doneOn || "") < (b.doneOn || "") ? 1 : -1; })
    .slice(0, 2);

  return (
    <div>
      <div className="section-heading"><h2>Recently completed</h2></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {finished.length === 0 && <div className="ledger-card"><strong>Nothing completed yet</strong><p className="text-dim" style={{ fontSize: "0.82rem" }}>Tick off a task and it will show up here.</p></div>}
        {finished.map(function (task) {
          return (
            <div className="ledger-card card-teal" key={task.id}>
              <strong>{task.title}</strong>
              <p className="text-dim" style={{ fontSize: "0.82rem" }}>{task.doneOn ? completedText(task.doneOn) : "Completed"}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
