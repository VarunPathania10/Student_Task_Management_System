import { dueText, isOverdue } from "../lib/common";

// ---------- 5b. Tasks due soon ----------
export default function TasksDueSoon(props) {
  // pending tasks, earliest due date first, only the first 3
  const upcoming = props.tasks
    .filter(function (task) { return !task.done && !task.archived; })
    .sort(function (a, b) { return a.due < b.due ? -1 : 1; })
    .slice(0, 3);

  const cardClass = { High: "card-rose", Medium: "", Low: "card-teal" };

  return (
    <div>
      <div className="section-heading"><h2>Tasks due soon</h2><a className="see-all" href="/pages/tasks.html">All tasks →</a></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {upcoming.length === 0 && <div className="ledger-card card-teal"><strong>All caught up!</strong><p className="text-dim" style={{ fontSize: "0.85rem", marginTop: "4px" }}>You have no pending tasks.</p></div>}
        {upcoming.map(function (task) {
          return (
            <div className={"ledger-card " + cardClass[task.priority]} key={task.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <strong>{task.title}</strong>
                {isOverdue(task)
                  ? <span className="chip chip-overdue">Overdue</span>
                  : <span className={"chip chip-" + task.priority.toLowerCase()}>{task.priority}</span>}
              </div>
              <p className="text-dim" style={{ fontSize: "0.85rem", marginTop: "4px" }}>{dueText(task.due)}</p>
              <button className="btn btn-sm" style={{ marginTop: "10px" }} onClick={function () { props.onDone(task.id); }}>✓ Mark as done</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
