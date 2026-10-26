import { daysLeft, getNextExam } from "../lib/common";
import { monthNames, weekdayNames } from "../lib/constants";

// ---------- 1. Welcome / hero ----------
export default function Hero(props) {
  const today = new Date();
  const dateText = weekdayNames[today.getDay()] + ", " + today.getDate() + " " + monthNames[today.getMonth()];

  // how many tasks are due in the next 7 days?
  let dueSoon = 0;
  props.tasks.forEach(function (task) {
    if (!task.done && !task.archived && daysLeft(task.due) >= 0 && daysLeft(task.due) <= 7) {
      dueSoon++;
    }
  });

  let message = "You have no tasks due in the next 7 days.";
  if (dueSoon === 1) {
    message = "You have 1 task due in the next 7 days.";
  } else if (dueSoon > 1) {
    message = "You have " + dueSoon + " tasks due in the next 7 days.";
  }

  const exam = getNextExam();
  if (exam !== null) {
    const days = daysLeft(exam.due);
    message += " Your next exam is " + exam.title + " " + (days === 0 ? "today" : "in " + days + (days === 1 ? " day" : " days")) + ".";
  }
  message += " Here's where things stand today.";

  const firstName = props.user.name.split(" ")[0];

  return (
    <section className="page-hero">
      <div className="container">
        <div className="eyebrow-row"><span className="chip chip-medium">{dateText}</span></div>
        <h1>{props.user.guest ? "Welcome, Guest." : "Welcome back, " + firstName + "."}</h1>
        <p>{message}</p>
      </div>
    </section>
  );
}
