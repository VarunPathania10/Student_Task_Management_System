import { useState, useEffect } from "react";
import { getUser, getTasks, saveTasks, getTaskCounts, todayString } from "./lib/common";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import ProfileSection from "./components/ProfileSection";
import QuickStats from "./components/QuickStats";
import QuickActions from "./components/QuickActions";
import TodaySchedule from "./components/TodaySchedule";
import TasksDueSoon from "./components/TasksDueSoon";
import ProgressOverview from "./components/ProgressOverview";
import RecentlyCompleted from "./components/RecentlyCompleted";
import Motivation from "./components/Motivation";

// ---------- The whole page ----------
export default function App() {
  const user = getUser();                      // null if nobody is logged in
  const [tasks, setTasks] = useState(getTasks); // the tasks, remembered by React

  // useEffect runs after the page is drawn.
  // 1) put the user's name in the browser tab title
  // 2) jump to a section if the address has one (e.g. home.html#dashboard),
  //    because React draws the sections AFTER the browser first tried to jump
  // 3) if tasks are changed in ANOTHER tab, load them again so this tab stays up to date
  useEffect(function () {
    if (user !== null) {
      document.title = user.name.split(" ")[0] + "'s Dashboard — Folio";
    }

    const target = window.location.hash.slice(1);
    if (target !== "" && target !== "loader") {
      const section = document.getElementById(target);
      if (section) {
        section.scrollIntoView();
      }
    }

    function reloadTasks() {
      setTasks(getTasks());
    }
    window.addEventListener("storage", reloadTasks);
    return function () {
      window.removeEventListener("storage", reloadTasks);   // clean up when the page closes
    };
  }, []);

  // not logged in: play the loading screen first, THEN go to Sign in
  if (user === null) {
    return <Loader onDone={function () { window.location.href = "/pages/signin.html#loader"; }} />;
  }

  // called when "Mark as done" is clicked
  function markDone(id) {
    const updated = tasks.map(function (task) {
      if (task.id === id) {
        return Object.assign({}, task, { done: true, doneOn: todayString() });
      }
      return task;
    });
    saveTasks(updated);   // save to the browser
    setTasks(updated);    // tell React the data changed, so the page re-draws
  }

  const counts = getTaskCounts();

  return (
    <div>
      <Loader />
      <Header user={user} />

      <main>
        <Hero user={user} tasks={tasks} />
        <ProfileSection user={user} />
        <QuickStats counts={counts} />
        <QuickActions />

        <section className="section-tight">
          <div className="container grid grid-2">
            <TodaySchedule />
            <TasksDueSoon tasks={tasks} onDone={markDone} />
          </div>
        </section>

        <ProgressOverview counts={counts} />

        <section className="section-tight">
          <div className="container grid grid-2">
            <RecentlyCompleted tasks={tasks} />
            <Motivation />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
