import { formatTime, getEvents, getTodayClasses, timetable, todayString } from "../lib/common";

// ---------- 5a. Today's schedule ----------
export default function TodaySchedule() {
  // classes from the timetable
  const rows = getTodayClasses().map(function (item) {
    return { time: item.time, type: item.type, text: item.text };
  });

  // events you added for today
  getEvents().forEach(function (event) {
    if (event.date === todayString()) {
      rows.push({ time: event.time ? formatTime(event.time) : "All day", type: "event", text: event.title });
    }
  });

  // colours for each type of row
  function chipFor(type, text) {
    if (type === "class") {
      return <span className="chip" style={{ color: "var(--gold)", background: "rgba(217,168,78,.12)" }}>{text}</span>;
    }
    if (type === "lab") {
      return <span className="chip chip-low">{text}</span>;
    }
    if (type === "study") {
      return <span className="chip" style={{ color: "var(--violet)", background: "rgba(139,131,224,.12)" }}>{text}</span>;
    }
    if (type === "exam") {
      return <span className="chip chip-high">{text}</span>;
    }
    return <span className="chip chip-medium">{text}</span>;
  }

  return (
    <div>
      <div className="section-heading"><h2>Today's schedule</h2><a className="see-all" href="/pages/schedule.html">Full calendar →</a></div>
      <div className="panel" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {rows.length === 0 && <p className="text-mid">Nothing scheduled for today. Enjoy your free day!</p>}
        {rows.map(function (row, index) {
          const isLast = index === rows.length - 1;
          return (
            <div key={index} style={{ display: "flex", justifyContent: "space-between", gap: "12px", borderBottom: isLast ? "none" : "1px solid var(--border)", paddingBottom: isLast ? 0 : "12px" }}>
              <span>{row.time}</span>{chipFor(row.type, row.text)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
