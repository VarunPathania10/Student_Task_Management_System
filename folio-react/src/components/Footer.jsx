
// ---------- C. Footer ----------
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">

        <div className="footer-brand">
          <a href="/" className="footer-logo">
            <span className="footer-logo-mark">F</span>
            <span>Folio</span>
          </a>
          <p className="footer-description">
            A smarter way for students to organize tasks, manage schedules, and stay on track.
          </p>
          <div className="footer-status">
            <span className="status-dot"></span>
            Built for students
          </div>
        </div>

        <div className="footer-column">
          <h4>Navigate</h4>
          <a href="/">Home</a>
          <a href="/pages/tasks.html">Tasks</a>
          <a href="/pages/schedule.html">Calendar</a>
          <a href="/pages/subjects.html">Subjects</a>
          <a href="/pages/progress.html">Progress</a>
        </div>

        <div className="footer-column">
          <h4>Explore</h4>
          <a href="/pages/about.html">About Folio</a>
          <a href="/pages/tasks.html">Task Manager</a>
          <a href="/pages/schedule.html">Study Schedule</a>
          <a href="/pages/subjects.html">Your Subjects</a>
          <a href="/pages/progress.html">Your Progress</a>
        </div>

        <div className="footer-cta">
          <div className="footer-cta-icon">✦</div>
          <h3>Stay organized.</h3>
          <p>Plan your work, track your progress, and make every study session count.</p>
          <a href="/pages/tasks.html" className="footer-cta-btn">
            Start Planning
            <span>→</span>
          </a>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="footer-copyright">© 2026 Folio. Built for better study days.</div>
        <div className="footer-bottom-links">
          <a href="/pages/about.html">About</a>
          <span>•</span>
          <a href="/pages/tasks.html">Tasks</a>
          <span>•</span>
          <a href="/pages/schedule.html">Schedule</a>
        </div>
        <div className="footer-made">Student Task Management System</div>
      </div>
    </footer>
  );
}
