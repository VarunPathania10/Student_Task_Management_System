// =====================================================
// subjects.js  -  the Subjects page
// =====================================================

requireLogin();

var subjects = getSubjects();

function showSubjects() {
  var html = "";

  for (var i = 0; i < subjects.length; i++) {
    var s = subjects[i];

    // the next task for this subject
    var next = getNextTaskForSubject(s.name);
    var upcoming = "No pending tasks. You're all caught up!";
    if (next !== null) {
      upcoming = "Upcoming: " + next.title.split(" — ").pop() + ", " + dueText(next.due).toLowerCase().replace("was due", "overdue —") + ".";
    }

    // exam info (an Exam task for this subject)
    var examText = "No exam scheduled yet";
    var tasks = getTasks();
    for (var t = 0; t < tasks.length; t++) {
      if (tasks[t].subject === s.name && tasks[t].category === "Exam" && !tasks[t].done && !tasks[t].archived) {
        examText = "Exam: " + dueText(tasks[t].due).replace("Due ", "").replace("Was due ", "was ");
      }
    }

    html += '<div class="subject-card">' +
      '<div class="subject-top">' +
        '<div><h3>' + s.name + '</h3><p class="text-dim" style="font-size:0.85rem;">' + s.teacher + " · " + s.credits + " credits</p></div>" +
        '<div class="subject-tag" style="background:' + s.tagBg + ';">' + s.code + "</div>" +
      "</div>" +
      "<div>" +
        '<div class="progress-row"><span>Course progress</span><span>' + s.progress + "%</span></div>" +
        '<div class="progress-track"><div class="progress-fill ' + s.fillClass + '" style="width:' + s.progress + "%; " + s.fillStyle + '"></div></div>' +
      "</div>" +
      '<div style="display:flex; gap:8px; align-items:center;">' +
        '<button class="icon-btn" data-index="' + i + '" data-change="-5" title="Decrease progress by 5%">−</button>' +
        '<button class="icon-btn" data-index="' + i + '" data-change="5" title="Increase progress by 5%">+</button>' +
        '<span class="text-dim" style="font-size:0.78rem;">Update progress</span>' +
      "</div>" +
      '<p class="text-mid" style="font-size:0.85rem;">' + upcoming + "</p>" +
      '<p class="text-dim" style="font-size:0.8rem;">' + examText + "</p>" +
    "</div>";
  }

  document.getElementById("subject-grid").innerHTML = html;
  document.getElementById("subject-count").textContent = subjects.length + " subjects this semester";
}

// + and - buttons
document.getElementById("subject-grid").addEventListener("click", function (event) {
  var button = event.target.closest(".icon-btn");
  if (button === null) {
    return;
  }
  var index = Number(button.getAttribute("data-index"));
  var change = Number(button.getAttribute("data-change"));

  var newValue = subjects[index].progress + change;
  if (newValue < 0) newValue = 0;
  if (newValue > 100) newValue = 100;
  subjects[index].progress = newValue;

  saveSubjects(subjects);
  showSubjects();
});

showSubjects();
