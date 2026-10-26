import { useState } from "react";
import { logout } from "../lib/common";

// ---------- B. Header / navigation bar ----------
const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "Dashboard", href: "/#dashboard" },
  { label: "Tasks", href: "/pages/tasks.html" },
  { label: "Calendar", href: "/pages/schedule.html" },
  { label: "Subjects", href: "/pages/subjects.html" },
  { label: "Progress", href: "/pages/progress.html" },
  { label: "About", href: "/pages/about.html" }
];

export default function Header(props) {
  // is the mobile (hamburger) menu open?
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout(event) {
    event.preventDefault();
    logout();   // from common.js
  }

  return (
    <header className="site-header">
      <div className="nav-bar">
        <a href="/" className="brand"><span className="brand-mark">F</span> Folio</a>

        {/* the checkbox is what the CSS uses to open the mobile menu;
            React now controls it with the menuOpen state */}
        <input type="checkbox" id="nav-toggle" className="nav-toggle" checked={menuOpen} onChange={function (e) { setMenuOpen(e.target.checked); }} />
        <label htmlFor="nav-toggle" className="hamburger" aria-label="Open menu">
          <span></span><span></span><span></span>
        </label>

        <nav className="nav-menu">
          {/* data-react-nav tells common.js not to add its own Logout link (React adds it below) */}
          <ul style={{ display: "flex", gap: "4px", flexDirection: "inherit" }}>
            {navLinks.map(function (link) {
              return (
                <li key={link.label}>
                  <a href={link.href} className={link.active ? "active" : ""} onClick={closeMenu}>{link.label}</a>
                </li>
              );
            })}
            {props.user && (
              <li>
                <a href="#" id="logout-link" title="Log out" onClick={handleLogout}>{props.user.name.split(" ")[0]} · Logout</a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
