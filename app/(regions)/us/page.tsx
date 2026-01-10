import Link from "next/link";

export default function USHome() {
  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1>Edunancial — United States</h1>
      <p>
        A global financial readiness and business-building platform designed to
        move founders from survival to scale.
      </p>

      <h2>Choose your track</h2>

      <ul>
        <li><Link href="/us/l1">Level 1 — Financial Survival</Link></li>
        <li><Link href="/us/l2">Level 2 — Stability & Cashflow</Link></li>
        <li><Link href="/us/l3">Level 3 — Business Ownership</Link></li>
        <li><Link href="/us/l4">Level 4 — Scaling & Capital</Link></li>
        <li><Link href="/us/l5">Level 5 — Investment & Governance</Link></li>
      </ul>

      <h2>Tools</h2>
      <ul>
        <li><Link href="/apps/edumath">EduMath</Link></li>
        <li><Link href="/apps/edunancial-levels">Levels Engine</Link></li>
        <li><Link href="/apps/eduvesting">EduVesting</Link></li>
      </ul>
    </main>
  );
}
