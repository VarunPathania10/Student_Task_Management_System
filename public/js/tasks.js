// =====================================================
// tasks.js  -  the Tasks page
// add, tick off, filter, archive and delete tasks
// =====================================================

requireLogin();

var tasks = getTasks();          // all tasks (loaded from the browser)
var currentFilter = "all";       // which filter pill is selected

// small emoji for each subject (same ones used before)
var subjectIcons = {
  "Data Structures": "🌳",
  "Java Programming": "☕",
  "Web Development": "💻",
  "Database Management": "📘",
  "Computer Networks": "🌐"
};


// ---------- build the HTML for ONE task card ----------
function makeTaskCard(task) {
  var chip = "";
  var cardStyle = "";
  var dateLine = "";

  if (task.done) {
    chip = '<span class="chip chip-done">Done</span>';
    if (task.doneOn) {
      dateLine = "<span>✅ " + completedText(task.doneOn) + "</span>";
    } else {
      dateLine = "<span>✅ Completed</span>";
    }
  } else if (isOverdue(task)) {
    var late = Math.abs(daysLeft(task.due));
    chip = '<span class="chip chip-overdue">Overdue · ' + late + (late === 1 ? " day" : " days") + "</span>";
    cardStyle = ' style="border-color: rgba(226,99,122,0.4);"';
    dateLine = "<span>📅 " + dueText(task.due) + "</span>";
  } else {
    chip = '<span class="chip chip-' + task.priority.toLowerCase() + '">' + task.priority + "</span>";
    dateLine = "<span>📅 " + dueText(task.due) + "</span>";
  }

  var icon = subjectIcons[task.subject] || "📚";
  var checked = task.done ? " checked" : "";

  var meta = "<span>" + icon + " " + safeText(task.subject) + "</span>" + dateLine;
  if (task.hours) {
    meta += "<span>⏱ " + task.hours + " hrs estimated</span>";
  }
  if (task.difficulty) {
    meta += "<span>⚡ Difficulty: " + task.difficulty + "</span>";
  }
  meta += "<span>🏷 " + task.category + "</span>";

  var description = "";
  if (task.desc) {
    description = '<p class="text-mid" style="font-size:0.9rem;">' + safeText(task.desc) + "</p>";
  }

  var archiveTitle = task.archived ? "Restore" : "Archive";
  var archiveIcon = task.archived ? "↩" : "🗄";

  return '<div class="task-card"' + cardStyle + ">" +
    '<input type="checkbox" class="check" data-id="' + task.id + '" aria-label="Mark complete"' + checked + ">" +
    '<div class="task-body">' +
      '<div class="task-top-row"><h4>' + safeText(task.title) + "</h4>" + chip + "</div>" +
      description +
      '<div class="task-meta">' + meta + "</div>" +
    "</div>" +
    '<div class="task-actions">' +
      '<button class="icon-btn" data-action="edit" data-id="' + task.id + '" title="Edit">✎</button>' +
      '<button class="icon-btn" data-action="archive" data-id="' + task.id + '" title="' + archiveTitle + '">' + archiveIcon + "</button>" +
      '<button class="icon-btn" data-action="delete" data-id="' + task.id + '" title="Delete">✕</button>' +
    "</div>" +
  "</div>";
}


// ---------- show everything on the page ----------
function showTasks() {
  var groups = { high: [], overdue: [], pending: [], done: [], archived: [] };

  // put every task in the right group
  for (var i = 0; i < tasks.length; i++) {
    var t = tasks[i];
    if (t.archived) {
      groups.archived.push(t);
    } else if (t.done) {
      groups.done.push(t);
    } else if (isOverdue(t)) {
      groups.overdue.push(t);
    } else if (t.priority === "High") {
      groups.high.push(t);
    } else {
      groups.pending.push(t);
    }
  }

  // which groups does the selected filter show?
  var visible = [];
  if (currentFilter === "all") {
    visible = ["high", "overdue", "pending", "done"];
  } else if (currentFilter === "pending") {
    visible = ["high", "overdue", "pending"];
  } else if (currentFilter === "upcoming") {
    visible = ["high", "pending"];     // these two groups are not overdue
  } else if (currentFilter === "high") {
    visible = ["high"];
  } else if (currentFilter === "overdue") {
    visible = ["overdue"];
  } else if (currentFilter === "done") {
    visible = ["done"];
  } else if (currentFilter === "archived") {
    visible = ["archived"];
  }

  var names = ["high", "overdue", "pending", "done", "archived"];
  var anythingShown = false;

  for (var n = 0; n < names.length; n++) {
    var name = names[n];
    var section = document.getElementById("sec-" + name);
    var list = document.getElementById("list-" + name);
    var html = "";

    // only build the cards for sections that the filter shows
    if (visible.indexOf(name) !== -1 && groups[name].length > 0) {
      for (var k = 0; k < groups[name].length; k++) {
        html += makeTaskCard(groups[name][k]);
      }
      section.style.display = "block";
      anythingShown = true;
    } else {
      section.style.display = "none";
    }
    list.innerHTML = html;
  }

  document.getElementById("empty-section").style.display = anythingShown ? "none" : "block";

  // top chip: "5 total · 4 pending"
  var counts = getTaskCounts();
  document.getElementById("task-summary").textContent =
    counts.total + " total · " + counts.pending + " pending";
}


// ---------- filter buttons ----------
var filterButtons = document.querySelectorAll('input[name="filter"]');
for (var i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener("change", function () {
    currentFilter = this.value;
    showTasks();
  });
}


// ---------- tick / untick a task ----------
document.querySelector("main").addEventListener("change", function (event) {
  if (!event.target.classList.contains("check")) {
    return;
  }
  var id = Number(event.target.getAttribute("data-id"));
  setTaskDone(id, event.target.checked);   // from common.js (saves too)
  tasks = getTasks();
  showTasks();
});


// ---------- archive and delete buttons ----------
document.querySelector("main").addEventListener("click", function (event) {
  var button = event.target.closest(".icon-btn");
  if (button === null) {
    return;
  }
  var id = Number(button.getAttribute("data-id"));
  var action = button.getAttribute("data-action");

  if (action === "edit") {
    startEditing(id);
    return;
  }

  if (action === "delete") {
    if (!confirm("Delete this task? This cannot be undone.")) {
      return;
    }
    var remaining = [];
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id !== id) {
        remaining.push(tasks[i]);
      }
    }
    tasks = remaining;
    if (editingId === id) {
      stopEditing();     // the task we were editing no longer exists
    }
  }

  if (action === "archive") {
    for (var j = 0; j < tasks.length; j++) {
      if (tasks[j].id === id) {
        tasks[j].archived = !tasks[j].archived;
      }
    }
  }

  saveTasks(tasks);
  showTasks();
});


// ---------- add a new task / edit an existing task ----------
var taskForm = document.getElementById("task-form");
var formMessage = document.getElementById("form-message");
var defaultNote = "Your tasks are saved in this browser, so they will still be here when you come back.";
var editingId = null;      // null = adding a new task, a number = editing that task

function showFormMessage(text, isError) {
  formMessage.textContent = text;
  formMessage.style.color = isError ? "var(--rose)" : "var(--teal)";
}

// put a task's details into the form so it can be changed
function startEditing(id) {
  var task = null;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      task = tasks[i];
    }
  }
  if (task === null) {
    return;
  }

  editingId = id;
  document.getElementById("t-title").value = task.title;
  document.getElementById("t-subject").value = task.subject;
  document.getElementById("t-due").value = task.due;
  document.getElementById("t-time").value = task.hours;
  document.getElementById("t-desc").value = task.desc || "";
  taskForm.elements["priority"].value = task.priority;
  taskForm.elements["category"].value = task.category;
  taskForm.elements["difficulty"].value = task.difficulty || "Easy";

  document.getElementById("form-heading").textContent = "Edit task";
  document.getElementById("task-submit").textContent = "Save changes";
  document.getElementById("task-reset").style.display = "none";
  document.getElementById("cancel-edit").style.display = "inline-flex";
  showFormMessage("Editing \"" + task.title + "\". Change what you need, then press Save changes.", false);

  document.getElementById("add-task").scrollIntoView();
  document.getElementById("t-title").focus();
}

// go back to the normal "Add a task" form
function stopEditing() {
  editingId = null;
  taskForm.reset();
  document.getElementById("form-heading").textContent = "Add a task";
  document.getElementById("task-submit").textContent = "Add task";
  document.getElementById("task-reset").style.display = "inline-flex";
  document.getElementById("cancel-edit").style.display = "none";
  formMessage.textContent = defaultNote;
  formMessage.style.color = "";
}

document.getElementById("cancel-edit").addEventListener("click", stopEditing);

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var title = document.getElementById("t-title").value.trim();
  var due = document.getElementById("t-due").value;
  var hours = document.getElementById("t-time").value;

  // --- check the inputs ---
  if (title === "") {
    showFormMessage("Please enter a task title.", true);
    return;
  }
  if (title.length > 80) {
    showFormMessage("The title is too long (maximum 80 characters).", true);
    return;
  }
  if (due === "" || isNaN(new Date(due + "T00:00:00"))) {
    showFormMessage("Please choose a valid due date.", true);
    return;
  }
  if (hours !== "" && (isNaN(Number(hours)) || Number(hours) < 0 || Number(hours) > 100)) {
    showFormMessage("Estimated time must be a number between 0 and 100.", true);
    return;
  }

  var details = {
    title: title,
    subject: document.getElementById("t-subject").value,
    due: due,
    hours: hours,
    desc: document.getElementById("t-desc").value.trim(),
    priority: taskForm.elements["priority"].value,
    category: taskForm.elements["category"].value,
    difficulty: taskForm.elements["difficulty"].value
  };

  if (editingId !== null) {
    // ----- EDIT: change the details but keep id, done and archived -----
    for (var j = 0; j < tasks.length; j++) {
      if (tasks[j].id === editingId) {
        details.id = tasks[j].id;
        details.done = tasks[j].done;
        if (tasks[j].doneOn) { details.doneOn = tasks[j].doneOn; }
        if (tasks[j].archived) { details.archived = true; }
        tasks[j] = details;
      }
    }
    saveTasks(tasks);
    stopEditing();
    showFormMessage("Task updated!", false);
  } else {
    // ----- ADD: give the new task a number that is not used yet -----
    var newId = 1;
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id >= newId) {
        newId = tasks[i].id + 1;
      }
    }
    details.id = newId;
    details.done = false;
    tasks.push(details);
    saveTasks(tasks);
    taskForm.reset();
    showFormMessage("Task added!", false);
  }

  // go back to showing all tasks so the new / changed one is visible
  currentFilter = "all";
  document.getElementById("f-all").checked = true;
  showTasks();
});

// the "Clear form" button should also clear the message
taskForm.addEventListener("reset", function () {
  formMessage.textContent = defaultNote;
  formMessage.style.color = "";
});


showTasks();

// the Calendar page links here with ?edit=3 to open task number 3 for editing
var editParam = new URLSearchParams(window.location.search).get("edit");
if (editParam !== null) {
  startEditing(Number(editParam));
}
