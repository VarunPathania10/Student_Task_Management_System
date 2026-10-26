// =====================================================
// schedule.js  -  the Calendar / Schedule page
// =====================================================

requireLogin();

var events = getEvents();

// ---------- "Week of 14 – 20 Sep" ----------
function showWeekLabel() {
  var today = new Date();
  var weekday = today.getDay();                 // 0 = Sunday
  var mondayOffset = weekday === 0 ? -6 : 1 - weekday;

  var monday = new Date();
  monday.setDate(today.getDate() + mondayOffset);
  var sunday = new Date();
  sunday.setDate(monday.getDate() + 6);

  var start = dateBadge(makeDateString(monday));
  var finish = dateBadge(makeDateString(sunday));
  document.getElementById("week-label").textContent =
    "Week of " + start.month + " " + start.day + " – " + finish.month + " " + finish.day;
}


// ---------- weekly timetable ----------
function showTimetable() {
  var html = "";
  var todayColumn = new Date().getDay() - 1;   // Monday = 0

  for (var row = 0; row < timetable.length; row++) {
    html += "<tr><td>" + timetableTimes[row] + "</td>";
    for (var col = 0; col < 5; col++) {
      var slot = timetable[row][col];
      if (slot === null) {
        html += "<td>—</td>";
      } else {
        html += '<td><span class="slot slot-' + slot[0] + '">' + slot[1] + "</span></td>";
      }
    }
    html += "</tr>";
  }
  document.getElementById("timetable-body").innerHTML = html;

  // make today's day name in the header gold
  var headings = document.querySelectorAll(".timetable thead th");
  if (todayColumn >= 0 && todayColumn < 5) {
    headings[todayColumn + 1].style.color = "var(--gold)";
    headings[todayColumn + 1].textContent = dayNames[todayColumn] + " (today)";
  }
}


// ---------- your events list (with delete) ----------
function sortEvents() {
  events.sort(function (a, b) {
    if (a.date !== b.date) {
      return a.date < b.date ? -1 : 1;
    }
    return (a.time || "") < (b.time || "") ? -1 : 1;
  });
}

function showMyEvents() {
  sortEvents();
  var section = document.getElementById("my-events-section");
  var list = document.getElementById("my-events");

  if (events.length === 0) {
    list.innerHTML = "";          // clear the old cards too
    section.style.display = "none";
    return;
  }
  section.style.display = "block";

  var html = "";
  for (var i = 0; i < events.length; i++) {
    var e = events[i];
    var badge = dateBadge(e.date);
    var timeText = e.time ? " · " + formatTime(e.time) : "";
    html += '<div class="panel event-card">' +
      '<div class="date-badge"><strong>' + badge.day + "</strong><span>" + badge.month + "</span></div>" +
      '<div style="flex:1;"><strong>' + safeText(e.title) + "</strong>" +
      '<p class="text-dim" style="font-size:0.85rem;">' + e.type + timeText + "</p></div>" +
      '<button class="icon-btn" data-id="' + e.id + '" title="Delete event">✕</button>' +
      "</div>";
  }
  list.innerHTML = html;
}

document.getElementById("my-events").addEventListener("click", function (event) {
  var button = event.target.closest(".icon-btn");
  if (button === null) {
    return;
  }
  var id = Number(button.getAttribute("data-id"));
  var remaining = [];
  for (var i = 0; i < events.length; i++) {
    if (events[i].id !== id) {
      remaining.push(events[i]);
    }
  }
  events = remaining;
  saveEvents(events);
  showAll();
});


// ---------- upcoming deadlines (tasks + events) ----------
function showDeadlines() {
  var items = [];

  var tasks = getTasks();
  for (var i = 0; i < tasks.length; i++) {
    var t = tasks[i];
    if (!t.done && !t.archived && daysLeft(t.due) >= 0) {
      items.push({ date: t.due, title: t.title, note: t.subject + " · " + dueText(t.due) });
    }
  }
  for (var j = 0; j < events.length; j++) {
    var e = events[j];
    if (daysLeft(e.date) >= 0) {
      var timeText = e.time ? ", " + formatTime(e.time) : "";
      items.push({ date: e.date, title: e.title, note: e.type + timeText });
    }
  }

  items.sort(function (a, b) {
    return a.date < b.date ? -1 : 1;
  });

  var html = "";
  var howMany = Math.min(items.length, 5);
  for (var k = 0; k < howMany; k++) {
    var badge = dateBadge(items[k].date);
    html += '<div class="panel event-card">' +
      '<div class="date-badge"><strong>' + badge.day + "</strong><span>" + badge.month + "</span></div>" +
      "<div><strong>" + safeText(items[k].title) + '</strong><p class="text-dim" style="font-size:0.85rem;">' +
      safeText(items[k].note) + "</p></div></div>";
  }
  if (howMany === 0) {
    html = '<div class="panel"><p class="text-mid">Nothing coming up. Enjoy the free time!</p></div>';
  }
  document.getElementById("deadline-list").innerHTML = html;
}


// ---------- exam countdown ----------
function showExamCountdown() {
  var box = document.getElementById("exam-box");
  var exam = getNextExam();

  if (exam === null) {
    box.innerHTML = '<p class="text-mid">No upcoming exams. Add an Exam task or event to start a countdown.</p>';
    return;
  }

  var days = daysLeft(exam.due);
  var daysText = days === 0 ? "Today" : days + (days === 1 ? " day" : " days");

  var html = '<p class="text-dim" style="font-size:0.82rem; text-transform:uppercase; letter-spacing:0.06em;">' +
    safeText(exam.title) + "</p>" +
    '<p class="stat-num accent-rose" style="font-size:2.6rem;">' + daysText + "</p>";

  // if it is an exam task, also show how far that course is
  var subject = exam.subject ? findSubject(exam.subject) : null;
  if (subject !== null) {
    html += '<div class="progress-track"><div class="progress-fill fill-rose" style="width:' + subject.progress + '%;"></div></div>' +
      '<p class="text-dim" style="margin-top:10px; font-size:0.85rem;">' + subject.name + " course " + subject.progress + "% complete</p>";
  }
  box.innerHTML = html;
}


// ---------- add an event ----------
var eventForm = document.getElementById("event-form");
var eventMessage = document.getElementById("event-message");

eventForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var title = document.getElementById("e-title").value.trim();
  var date = document.getElementById("e-date").value;

  if (title === "") {
    eventMessage.textContent = "Please enter an event title.";
    eventMessage.style.color = "var(--rose)";
    return;
  }
  if (date === "") {
    eventMessage.textContent = "Please choose a date.";
    eventMessage.style.color = "var(--rose)";
    return;
  }

  var newId = 1;
  for (var i = 0; i < events.length; i++) {
    if (events[i].id >= newId) {
      newId = events[i].id + 1;
    }
  }

  events.push({
    id: newId,
    title: title,
    type: document.getElementById("e-type").value,
    date: date,
    time: document.getElementById("e-time").value
  });
  saveEvents(events);

  eventForm.reset();
  eventMessage.textContent = "Event added to your calendar!";
  eventMessage.style.color = "var(--teal)";
  showAll();
});


// ---------- MONTH CALENDAR ----------
// calMonth uses 0 = January ... 11 = December
var calYear = new Date().getFullYear();
var calMonth = new Date().getMonth();
var selectedDate = todayString();

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// all the tasks (not archived) that are due on one date
function tasksOnDate(dateText) {
  var all = getTasks();
  var result = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].due === dateText && !all[i].archived) {
      result.push(all[i]);
    }
  }
  return result;
}

// all the events on one date
function eventsOnDate(dateText) {
  var result = [];
  for (var i = 0; i < events.length; i++) {
    if (events[i].date === dateText) {
      result.push(events[i]);
    }
  }
  return result;
}

// draws the grid of days for the month that is selected
function showCalendar() {
  document.getElementById("cal-title").textContent = monthNames[calMonth] + " " + calYear;

  var html = "";
  var heads = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  for (var h = 0; h < heads.length; h++) {
    html += '<div class="cal-head">' + heads[h] + "</div>";
  }

  // how many empty boxes come before the 1st? (week starts on Monday)
  var firstWeekday = new Date(calYear, calMonth, 1).getDay();   // 0 = Sunday
  var blanks = firstWeekday === 0 ? 6 : firstWeekday - 1;
  for (var b = 0; b < blanks; b++) {
    html += '<div class="cal-empty"></div>';
  }

  var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  for (var day = 1; day <= daysInMonth; day++) {
    var dateText = makeDateString(new Date(calYear, calMonth, day));
    var dayTasks = tasksOnDate(dateText);
    var dayEvents = eventsOnDate(dateText);

    var classes = "cal-day";
    if (dateText === todayString()) { classes += " is-today"; }
    if (dateText === selectedDate) { classes += " is-selected"; }

    var chips = "";
    var dots = "";
    var shown = 0;
    for (var t = 0; t < dayTasks.length; t++) {
      var task = dayTasks[t];
      dots += '<span class="cal-dot dot-' + task.priority.toLowerCase() + '"></span>';
      if (shown < 2) {
        chips += '<span class="cal-chip chip-' + task.priority.toLowerCase() + '-bg' + (task.done ? " is-done" : "") + '">' + safeText(task.title) + "</span>";
        shown++;
      }
    }
    for (var v = 0; v < dayEvents.length; v++) {
      dots += '<span class="cal-dot dot-event"></span>';
      if (shown < 2) {
        chips += '<span class="cal-chip chip-event-bg">' + safeText(dayEvents[v].title) + "</span>";
        shown++;
      }
    }
    var total = dayTasks.length + dayEvents.length;
    if (total > shown) {
      chips += '<span class="cal-more">+' + (total - shown) + " more</span>";
    }

    html += '<button type="button" class="' + classes + '" data-date="' + dateText + '">' +
      '<span class="cal-number">' + day + "</span>" + chips + '<span class="cal-dots">' + dots + "</span></button>";
  }

  document.getElementById("cal-grid").innerHTML = html;
}

// shows the tasks and events of the selected date under the calendar
function showDayPanel() {
  var d = new Date(selectedDate + "T00:00:00");
  document.getElementById("day-title").textContent =
    weekdayNames[d.getDay()] + ", " + d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();

  var dayTasks = tasksOnDate(selectedDate);
  var dayEvents = eventsOnDate(selectedDate);
  var html = "";

  for (var i = 0; i < dayTasks.length; i++) {
    var t = dayTasks[i];
    html += '<div class="day-row">' +
      '<input type="checkbox" class="check" data-task="' + t.id + '" aria-label="Mark complete"' + (t.done ? " checked" : "") + ">" +
      '<div class="day-row-text' + (t.done ? " is-done" : "") + '"><strong>' + safeText(t.title) + "</strong>" +
        '<p class="text-dim" style="font-size:0.82rem;">' + safeText(t.subject) + " · " + t.category + " · " + t.priority + " priority</p></div>" +
      '<div class="day-row-actions">' +
        '<a class="icon-btn" href="tasks.html?edit=' + t.id + '#add-task" title="Edit on the Tasks page">✎</a>' +
        '<button type="button" class="icon-btn" data-delete-task="' + t.id + '" title="Delete task">✕</button>' +
      "</div></div>";
  }

  for (var j = 0; j < dayEvents.length; j++) {
    var e = dayEvents[j];
    html += '<div class="day-row">' +
      '<span class="chip chip-medium">Event</span>' +
      '<div class="day-row-text"><strong>' + safeText(e.title) + "</strong>" +
        '<p class="text-dim" style="font-size:0.82rem;">' + e.type + (e.time ? " · " + formatTime(e.time) : "") + "</p></div>" +
      '<div class="day-row-actions"><button type="button" class="icon-btn" data-delete-event="' + e.id + '" title="Delete event">✕</button></div>' +
      "</div>";
  }

  if (html === "") {
    html = '<p class="text-mid">Nothing on this date. Use the box below to add a task.</p>';
  }
  document.getElementById("day-items").innerHTML = html;
}

// fill the subject drop-down of the quick-add form
function fillDaySubjects() {
  var list = getSubjects();
  var html = "";
  for (var i = 0; i < list.length; i++) {
    html += "<option>" + safeText(list[i].name) + "</option>";
  }
  document.getElementById("day-new-subject").innerHTML = html;
}

// click on a date -> select it
document.getElementById("cal-grid").addEventListener("click", function (event) {
  var cell = event.target.closest(".cal-day");
  if (cell === null) {
    return;
  }
  selectedDate = cell.getAttribute("data-date");
  showCalendar();
  showDayPanel();
});

// previous / next / today buttons
function goToMonth(year, month) {
  var first = new Date(year, month, 1);          // JavaScript fixes month 12 -> January of next year
  calYear = first.getFullYear();
  calMonth = first.getMonth();
  // select today if we are in the current month, otherwise the 1st
  var today = new Date();
  if (calYear === today.getFullYear() && calMonth === today.getMonth()) {
    selectedDate = todayString();
  } else {
    selectedDate = makeDateString(first);
  }
  showCalendar();
  showDayPanel();
}

document.getElementById("cal-prev").addEventListener("click", function () { goToMonth(calYear, calMonth - 1); });
document.getElementById("cal-next").addEventListener("click", function () { goToMonth(calYear, calMonth + 1); });
document.getElementById("cal-today").addEventListener("click", function () {
  goToMonth(new Date().getFullYear(), new Date().getMonth());
});

// tick a task inside the day panel
document.getElementById("day-items").addEventListener("change", function (event) {
  if (!event.target.classList.contains("check")) {
    return;
  }
  setTaskDone(Number(event.target.getAttribute("data-task")), event.target.checked);
  showAll();
});

// delete a task or an event inside the day panel
document.getElementById("day-items").addEventListener("click", function (event) {
  var button = event.target.closest(".icon-btn");
  if (button === null) {
    return;
  }

  var taskId = button.getAttribute("data-delete-task");
  if (taskId !== null) {
    if (!confirm("Delete this task? This cannot be undone.")) {
      return;
    }
    var all = getTasks();
    var remaining = [];
    for (var i = 0; i < all.length; i++) {
      if (all[i].id !== Number(taskId)) {
        remaining.push(all[i]);
      }
    }
    saveTasks(remaining);
  }

  var eventId = button.getAttribute("data-delete-event");
  if (eventId !== null) {
    var keep = [];
    for (var j = 0; j < events.length; j++) {
      if (events[j].id !== Number(eventId)) {
        keep.push(events[j]);
      }
    }
    events = keep;
    saveEvents(events);
  }
  showAll();
});

// quick add: a new task on the selected date
var dayForm = document.getElementById("day-form");
var dayMessage = document.getElementById("day-message");

dayForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var title = document.getElementById("day-new-title").value.trim();

  if (title === "") {
    dayMessage.textContent = "Please type a task title first.";
    dayMessage.style.color = "var(--rose)";
    return;
  }
  if (title.length > 80) {
    dayMessage.textContent = "The title is too long (maximum 80 characters).";
    dayMessage.style.color = "var(--rose)";
    return;
  }

  var all = getTasks();
  var newId = 1;
  for (var i = 0; i < all.length; i++) {
    if (all[i].id >= newId) {
      newId = all[i].id + 1;
    }
  }
  all.push({
    id: newId,
    title: title,
    subject: document.getElementById("day-new-subject").value,
    due: selectedDate,
    hours: "",
    desc: "",
    priority: document.getElementById("day-new-priority").value,
    category: "Assignment",
    difficulty: "Medium",
    done: false
  });
  saveTasks(all);

  dayForm.reset();
  dayMessage.textContent = "Task added to " + selectedDate + "!";
  dayMessage.style.color = "var(--teal)";
  showAll();
});


function showAll() {
  showCalendar();
  showDayPanel();
  showMyEvents();
  showDeadlines();
  showExamCountdown();
}

showWeekLabel();
showTimetable();
fillDaySubjects();
showAll();
