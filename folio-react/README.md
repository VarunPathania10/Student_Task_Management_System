# Folio — React + Vite

The home page (loading screen, navbar, dashboard, footer) is a Vite + React app.
The other pages (Tasks, Calendar, Subjects, Progress, About, Sign in) are the original
plain HTML/JS pages, kept in `public/pages` so every link still works.

## Run
```
npm install
npm run dev        # http://localhost:5173
```
Build for production: `npm run build` (output in `dist/`), preview with `npm run preview`.

Start at `/pages/signin.html` (or `/landing.html`), sign in, and you land on the React home page at `/`.

## Structure
- `src/main.jsx` – entry point
- `src/App.jsx` – page layout, task state
- `src/components/` – Loader, Header, Footer, Hero, ProfileSection, QuickStats, QuickActions, TodaySchedule, TasksDueSoon, ProgressOverview, RecentlyCompleted, Motivation
- `src/lib/common.js` – shared helpers (login, tasks, dates) as an ES module
- `src/lib/constants.js` – month/weekday names, quotes
- `src/styles/` – common.css, home.css, loader.css
- `public/` – the original non-React pages, css and js
