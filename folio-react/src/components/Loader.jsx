import { useState, useEffect } from "react";

// ---------- A. Loading screen ----------
// Plays ONCE when the website is first opened in a browser tab (about 3 seconds:
// the bar fills for 2.5s, then the screen fades out for 0.5s).
// It uses the same "folioLoaderShown" flag as the Sign in / landing pages, so whichever
// page you open first plays it, and after that it never plays again in this tab
// (not on Home, not on Dashboard, not on refresh). Closing the tab resets it.
export default function Loader(props) {
  const [visible, setVisible] = useState(function () {
    if (sessionStorage.getItem("folioLoaderShown")) {
      return false;                                    // already played in this tab
    }
    sessionStorage.setItem("folioLoaderShown", "yes"); // remember it
    return true;
  });

  useEffect(function () {
    if (!visible) {
      if (props.onDone) props.onDone();   // nothing to show, carry on straight away
      return;
    }
    const timer = setTimeout(function () {
      setVisible(false);
      if (props.onDone) props.onDone();
    }, 3000);
    return function () { clearTimeout(timer); };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="loader-screen" id="loader">
      <div className="loader-inner">
        <div className="loader-mark">F</div>
        <h1 className="loader-title">FOLIO</h1>
        <p className="loader-subtitle">Student Task Management System</p>
        <div className="loader-progress"><div className="loader-progress-bar"></div></div>
        <p className="loader-text">Initializing your workspace<span className="dots">...</span></p>
      </div>
    </div>
  );
}
