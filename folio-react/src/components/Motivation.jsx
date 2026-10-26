import { quotes } from "../lib/constants";

// ---------- 7b. Motivational quote (a different one each day) ----------
export default function Motivation() {
  const quote = quotes[new Date().getDate() % quotes.length];
  return (
    <div>
      <div className="section-heading"><h2>Today's motivation</h2></div>
      <div className="quote-strip">
        <p>"{quote}"</p>
        <cite>— Folio Study Tips</cite>
      </div>
    </div>
  );
}
