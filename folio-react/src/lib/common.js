// =====================================================
// common.js  -  shared code used by every page
// Handles: saving data, the logged-in user, logout
// =====================================================

// ---------- SMALL HELPERS ----------

// reads a value from localStorage. If it is missing or damaged, returns null
// (so one bad value can never break the whole website)
export function loadJSON(storage, key) {
  var saved = storage.getItem(key);
  if (saved === null) {
    return null;
  }
  try {
    return JSON.parse(saved);
  } catch (error) {
    return null;
  }
}

// makes text safe to put inside innerHTML
// (so a title like "<b>hi</b>" is shown as text and cannot change the page)
export function safeText(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


// ---------- DATES ----------

// returns a date as text like "2026-09-14"
export function makeDateString(dateObj) {
  var year = dateObj.getFullYear();
  var month = String(dateObj.getMonth() + 1).padStart(2, "0");
  var day = String(dateObj.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// today's date as text
export function todayString() {
  return makeDateString(new Date());
}

// date that is "n" days from today (n can be negative)
export function daysFromToday(n) {
  var d = new Date();
  d.setDate(d.getDate() + n);
  return makeDateString(d);
}

// how many days from today until a date (negative = already passed)
export function daysLeft(dateText) {
  var oneDay = 24 * 60 * 60 * 1000;
  var due = new Date(dateText + "T00:00:00");
  var today = new Date(todayString() + "T00:00:00");
  return Math.round((due - today) / oneDay);
}

// turns a date into friendly text, e.g. "Due tomorrow"
export function dueText(dateText) {
  var n = daysLeft(dateText);
  if (n < -1) return "Was due " + Math.abs(n) + " days ago";
  if (n === -1) return "Was due yesterday";
  if (n === 0) return "Due today";
  if (n === 1) return "Due tomorrow";
  return "Due in " + n + " days";
}

// text for completed tasks, e.g. "Completed yesterday"
export function completedText(dateText) {
  var n = Math.abs(daysLeft(dateText));
  if (n === 0) return "Completed today";
  if (n === 1) return "Completed yesterday";
  return "Completed " + n + " days ago";
}

// "2026-09-18" -> { day: "18", month: "Sep" }
export function dateBadge(dateText) {
  var d = new Date(dateText + "T00:00:00");
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return { day: d.getDate(), month: months[d.getMonth()] };
}


// ---------- USER (login info) ----------

// the account that is logged in is saved in the browser.
// "Remember me" ticked  -> localStorage   (stays after closing the browser)
// "Remember me" empty   -> sessionStorage (cleared when the tab closes)
export function getUser() {
  return loadJSON(localStorage, "folioUser") || loadJSON(sessionStorage, "folioUser");
}

export function saveLoggedInUser(user, remember) {
  var text = JSON.stringify(user);
  localStorage.removeItem("folioUser");
  sessionStorage.removeItem("folioUser");
  if (remember) {
    localStorage.setItem("folioUser", text);
  } else {
    sessionStorage.setItem("folioUser", text);
  }
}

// all the accounts that were created with "Create one"
export function getAccounts() {
  return loadJSON(localStorage, "folioAccounts") || [];
}

export function saveAccounts(accounts) {
  localStorage.setItem("folioAccounts", JSON.stringify(accounts));
}

// "dev sharma" -> "DS"
export function getInitials(name) {
  var words = name.trim().split(" ");
  var initials = words[0].charAt(0);
  if (words.length > 1) {
    initials = initials + words[words.length - 1].charAt(0);
  }
  return initials.toUpperCase();
}

// "dev.sharma@gmail.com" -> "Dev Sharma"
export function nameFromEmail(email) {
  var start = email.split("@")[0];
  var words = start.split(/[._-]+/);
  var result = [];
  for (var i = 0; i < words.length; i++) {
    if (words[i] !== "") {
      result.push(words[i].charAt(0).toUpperCase() + words[i].slice(1));
    }
  }
  return result.join(" ");
}

export function logout() {
  localStorage.removeItem("folioUser");
  sessionStorage.removeItem("folioUser");
  window.location.href = "/pages/signin.html#loader";
}

// call this at the top of pages that need a login.
// if nobody is logged in, go to the sign in page.
export function requireLogin() {
  var user = getUser();
  if (user === null) {
    window.location.href = "/pages/signin.html#loader";
  }
  return user;
}


// ---------- TASKS ----------

// tasks shown the very first time (same ones that were in the HTML)
export function makeStarterTasks() {
  return [
    { id: 1, difficulty: "Hard", title: "DBMS Assignment 3 — ER Diagram Design", subject: "Database Management",
      due: daysFromToday(1), hours: 3, priority: "High", category: "Assignment", done: false,
      desc: "Design a normalized ER diagram for a library management system, covering entities, relationships and cardinality." },
    { id: 2, difficulty: "Hard", title: "Computer Networks — Mid-Sem Exam", subject: "Computer Networks",
      due: daysFromToday(4), hours: 6, priority: "High", category: "Exam", done: false,
      desc: "Covers OSI model, TCP/IP, routing algorithms and subnetting. Revise chapters 1–6." },
    { id: 3, difficulty: "Medium", title: "Java Programming — Inheritance Lab", subject: "Java Programming",
      due: daysFromToday(-2), hours: 2, priority: "Medium", category: "Homework", done: false,
      desc: "Implement a class hierarchy demonstrating single and multilevel inheritance." },
    { id: 4, difficulty: "Medium", title: "Web Development — Responsive Portfolio Page", subject: "Web Development",
      due: daysFromToday(6), hours: 4, priority: "Medium", category: "Project", done: false,
      desc: "Build a responsive personal portfolio using CSS Grid and Flexbox." },
    { id: 5, difficulty: "Easy", title: "Data Structures — Binary Tree Traversal Notes", subject: "Data Structures",
      due: daysFromToday(8), hours: 1.5, priority: "Low", category: "Homework", done: false,
      desc: "Summarize inorder, preorder and postorder traversal with code snippets." },
    { id: 6, difficulty: "Medium", title: "Computer Networks — Lab Report 2", subject: "Computer Networks",
      due: daysFromToday(-1), hours: 2, priority: "Low", category: "Assignment", done: true,
      doneOn: daysFromToday(-1),
      desc: "Submitted analysis of packet transmission using Wireshark captures." },
    { id: 7, difficulty: "Easy", title: "Web Development — CSS Layout Exercise", subject: "Web Development",
      due: daysFromToday(-2), hours: 1, priority: "Low", category: "Homework", done: true,
      doneOn: daysFromToday(-2),
      desc: "Recreated a magazine-style layout using CSS Grid." }
  ];
}

// every user has their own task list (key includes their email)
export function tasksKey() {
  var user = getUser();
  var who = user ? user.email : "guest";
  return "folioTasks_" + who;
}

export function getTasks() {
  var saved = loadJSON(localStorage, tasksKey());
  if (saved === null) {
    var starter = makeStarterTasks();
    saveTasks(starter);
    return starter;
  }
  return saved;
}

export function saveTasks(tasks) {
  localStorage.setItem(tasksKey(), JSON.stringify(tasks));
}

// a task is overdue if it is not done and its date has passed
export function isOverdue(task) {
  return task.done === false && daysLeft(task.due) < 0;
}

// a task is upcoming if it is not done and its date is today or later
// (pending = overdue + upcoming)
export function isUpcoming(task) {
  return task.done === false && daysLeft(task.due) >= 0;
}

// tick or untick one task by its id, then save (used by the Tasks page and the Calendar)
export function setTaskDone(id, isDone) {
  var tasks = getTasks();
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].done = isDone;
      if (isDone) {
        tasks[i].doneOn = todayString();
      } else {
        delete tasks[i].doneOn;
      }
    }
  }
  saveTasks(tasks);
}

// counts used by the home page, progress page, etc.
export function getTaskCounts() {
  var tasks = getTasks();
  var counts = { total: 0, done: 0, pending: 0, overdue: 0 };
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].archived) {
      continue; // archived tasks are not counted
    }
    counts.total++;
    if (tasks[i].done) {
      counts.done++;
    } else {
      counts.pending++;
      if (isOverdue(tasks[i])) {
        counts.overdue++;
      }
    }
  }
  counts.percent = counts.total === 0 ? 0 : Math.round((counts.done / counts.total) * 100);
  return counts;
}


// ---------- CALENDAR EVENTS ----------

export function eventsKey() {
  var user = getUser();
  var who = user ? user.email : "guest";
  return "folioEvents_" + who;
}

export function getEvents() {
  return loadJSON(localStorage, eventsKey()) || [];
}

export function saveEvents(events) {
  localStorage.setItem(eventsKey(), JSON.stringify(events));
}


// ---------- SUBJECTS ----------

export function subjectsKey() {
  var user = getUser();
  var who = user ? user.email : "guest";
  return "folioSubjects_" + who;
}

export function getSubjects() {
  var saved = loadJSON(localStorage, subjectsKey());
  if (saved !== null) {
    return saved;
  }
  // first time: start with these 5 subjects
  var starter = [
    { name: "Data Structures", code: "DS", teacher: "Dr. R. Kapoor", credits: 4, progress: 68,
      tagBg: "linear-gradient(135deg,var(--gold),var(--gold-soft))", fillClass: "", fillStyle: "" },
    { name: "Java Programming", code: "JV", teacher: "Prof. S. Nair", credits: 3, progress: 54,
      tagBg: "linear-gradient(135deg,var(--teal),#7fe6db)", fillClass: "fill-teal", fillStyle: "" },
    { name: "Web Development", code: "WD", teacher: "Ms. P. Iyer", credits: 3, progress: 75,
      tagBg: "linear-gradient(135deg,var(--rose),#f0899b)", fillClass: "fill-rose", fillStyle: "" },
    { name: "Database Management", code: "DB", teacher: "Dr. A. Verma", credits: 4, progress: 60,
      tagBg: "linear-gradient(135deg,var(--violet),#aca6ea)", fillClass: "",
      fillStyle: "background:linear-gradient(90deg,var(--violet),#aca6ea);" },
    { name: "Computer Networks", code: "CN", teacher: "Dr. M. Rao", credits: 3, progress: 48,
      tagBg: "linear-gradient(135deg,var(--gold),var(--rose))", fillClass: "", fillStyle: "" }
  ];
  localStorage.setItem(subjectsKey(), JSON.stringify(starter));
  return starter;
}

export function saveSubjects(subjects) {
  localStorage.setItem(subjectsKey(), JSON.stringify(subjects));
}

// finds one subject by its name
export function findSubject(name) {
  var subjects = getSubjects();
  for (var i = 0; i < subjects.length; i++) {
    if (subjects[i].name === name) {
      return subjects[i];
    }
  }
  return null;
}


// ---------- WEEKLY TIMETABLE ----------
// each row is a time slot, each slot has Mon..Fri
// type is one of: class, lab, exam, study  (matches the CSS classes)

export var timetableTimes = ["9:00 – 10:00", "10:00 – 11:00", "11:00 – 1:00", "2:00 – 3:00", "6:00 – 7:30"];
export var dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export var timetable = [
  // 9:00
  [ ["class", "Data Structures"], ["class", "Java Programming"], ["class", "Data Structures"], ["class", "DBMS"], ["class", "Computer Networks"] ],
  // 10:00
  [ ["class", "DBMS"], null, ["class", "Computer Networks"], ["class", "Java Programming"], null ],
  // 11:00
  [ ["lab", "Web Dev Lab"], ["lab", "DBMS Lab"], null, ["lab", "Networks Lab"], ["lab", "Java Lab"] ],
  // 2:00
  [ null, ["class", "Web Development"], ["class", "Web Development"], null, ["exam", "CN Quiz"] ],
  // 6:00
  [ ["study", "Self-study: DBMS"], ["study", "Self-study: DS"], ["study", "Self-study: CN"], ["study", "Self-study: Java"], null ]
];

// returns today's classes, e.g. [{time: "9:00 – 10:00", type: "class", text: "Data Structures"}]
// (Saturday and Sunday have no classes)
export function getTodayClasses() {
  var weekday = new Date().getDay();   // 0 = Sunday ... 6 = Saturday
  if (weekday === 0 || weekday === 6) {
    return [];
  }
  var column = weekday - 1;            // Monday = column 0
  var result = [];
  for (var row = 0; row < timetable.length; row++) {
    var slot = timetable[row][column];
    if (slot !== null) {
      result.push({ time: timetableTimes[row], type: slot[0], text: slot[1] });
    }
  }
  return result;
}

// "14:30" -> "2:30 PM"
export function formatTime(timeText) {
  if (!timeText) {
    return "";
  }
  var parts = timeText.split(":");
  var hour = Number(parts[0]);
  var ending = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) {
    hour = 12;
  }
  return hour + ":" + parts[1] + " " + ending;
}


// ---------- NUMBERS FOR HOME / PROGRESS PAGES ----------

// how many days in a row (up to today) you have finished at least one task
export function getStreak() {
  var tasks = getTasks();
  var days = {};
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].done && tasks[i].doneOn) {
      days[tasks[i].doneOn] = true;
    }
  }
  var streak = 0;
  var offset = 0;
  // if nothing is done today yet, start counting from yesterday
  if (!days[daysFromToday(0)]) {
    offset = -1;
  }
  while (days[daysFromToday(offset)]) {
    streak++;
    offset--;
  }
  return streak;
}

// total hours of tasks finished in the last 7 days
export function getHoursThisWeek() {
  var tasks = getTasks();
  var total = 0;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].done && tasks[i].doneOn && !tasks[i].archived) {
      var ago = -daysLeft(tasks[i].doneOn);
      if (ago >= 0 && ago < 7) {
        total += Number(tasks[i].hours) || 0;
      }
    }
  }
  return total;
}

// productivity score out of 100:
// 70% depends on how many tasks are done, 30% on having no overdue tasks
export function getProductivityScore() {
  var counts = getTaskCounts();
  if (counts.total === 0) {
    return 0;
  }
  var noOverdue = 100 - Math.min(100, counts.overdue * 25);
  return Math.round(counts.percent * 0.7 + noOverdue * 0.3);
}

// the next exam: an Exam task that is not done, or an Exam event
// returns { title, due, subject } or null
export function getNextExam() {
  var best = null;
  var tasks = getTasks();
  for (var i = 0; i < tasks.length; i++) {
    var t = tasks[i];
    if (t.category === "Exam" && !t.done && !t.archived && daysLeft(t.due) >= 0) {
      if (best === null || t.due < best.due) {
        best = { title: t.title, due: t.due, subject: t.subject };
      }
    }
  }
  var events = getEvents();
  for (var j = 0; j < events.length; j++) {
    var e = events[j];
    if (e.type === "Exam" && daysLeft(e.date) >= 0) {
      if (best === null || e.date < best.due) {
        best = { title: e.title, due: e.date, subject: null };
      }
    }
  }
  return best;
}

// the first pending task of a subject (earliest due date)
export function getNextTaskForSubject(subjectName) {
  var tasks = getTasks();
  var best = null;
  for (var i = 0; i < tasks.length; i++) {
    var t = tasks[i];
    if (t.subject === subjectName && !t.done && !t.archived) {
      if (best === null || t.due < best.due) {
        best = t;
      }
    }
  }
  return best;
}


