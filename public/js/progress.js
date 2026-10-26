// =====================================================
// progress.js  -  the Progress page
// every number here is worked out from your saved tasks
// =====================================================

requireLogin();

var counts = getTaskCounts();
var tasks = getTasks();
var subjects = getSubjects();

function setText(id, text) {
  document.getElementById(id).textContent = text;
}

// ---------- top stats ----------
setText("p-percent", counts.percent + "%");
setText("p-hours", getHoursThisWeek() + " hrs");
setText("p-tasks", counts.done + " / " + counts.total);
setText("p-score", getProductivityScore());

// ---------- ring ----------
document.getElementById("p-ring").style.setProperty("--pct", counts.percent);
setText("p-ring-text", counts.percent + "%");
setText("p-ring-note", counts.done + " of " + counts.total + " tasks finished. " +
  counts.pending + " pending, " + counts.overdue + " overdue.");

// ---------- bar chart: tasks finished on each day of this week ----------
var barNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var today = new Date();
var weekday = today.getDay();
var mondayOffset = weekday === 0 ? -6 : 1 - weekday;

var barHtml = "";
for (var d = 0; d < 7; d++) {
  var dayText = daysFromToday(mondayOffset + d);

  var finished = 0;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].done && tasks[i].doneOn === dayText && !tasks[i].archived) {
      finished++;
    }
  }

  // each finished task adds 25% height (small minimum so the bar is visible)
  var height = Math.min(100, 8 + finished * 25);
  barHtml += '<div class="bar-col"><div class="bar" style="height:' + height + '%;" title="' +
    finished + ' task(s) finished"></div><span>' + barNames[d] + "</span></div>";
}
document.getElementById("p-bars").innerHTML = barHtml;

// ---------- subject progress ----------
var subjectHtml = "";
for (var s = 0; s < subjects.length; s++) {
  var sub = subjects[s];
  subjectHtml += "<div>" +
    '<div class="progress-row"><span>' + sub.name + "</span><span>" + sub.progress + "%</span></div>" +
    '<div class="progress-track"><div class="progress-fill ' + sub.fillClass + '" style="width:' + sub.progress + "%; " + sub.fillStyle + '"></div></div>' +
    "</div>";
}
document.getElementById("p-subjects").innerHTML = subjectHtml;

// ---------- assignments ----------
var assignTotal = 0;
var assignDone = 0;
for (var a = 0; a < tasks.length; a++) {
  if (tasks[a].category === "Assignment" && !tasks[a].archived) {
    assignTotal++;
    if (tasks[a].done) {
      assignDone++;
    }
  }
}
var assignPercent = assignTotal === 0 ? 0 : Math.round((assignDone / assignTotal) * 100);
setText("p-assign-text", assignDone + " / " + assignTotal);
document.getElementById("p-assign-bar").style.width = assignPercent + "%";

// ---------- exam preparation ----------
var exam = getNextExam();
var examBox = document.getElementById("p-exam");
var examSubject = (exam !== null && exam.subject) ? findSubject(exam.subject) : null;

if (exam === null) {
  examBox.innerHTML = '<p class="text-mid">No upcoming exams.</p>';
} else if (examSubject === null) {
  examBox.innerHTML = '<p class="text-mid">' + exam.title + " in " + daysLeft(exam.due) + " days.</p>";
} else {
  examBox.innerHTML = '<div class="progress-row"><span>' + safeText(exam.title) + "</span><span>" + examSubject.progress + "%</span></div>" +
    '<div class="progress-track"><div class="progress-fill fill-rose" style="width:' + examSubject.progress + '%;"></div></div>';
}

// ---------- goals ----------
setText("goal-pending", counts.pending + " task(s) still pending");
setText("goal-overdue", counts.overdue === 0 ? "Nothing overdue. Great work!" : counts.overdue + " overdue task(s) to clear");
setText("goal-streak", getStreak() + " of 30 days so far");
