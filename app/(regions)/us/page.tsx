import Link from "next/link";

export default function USRegion() {
  return (
    <main style={{ padding: "40px", fontFamily: "system-ui" }}>
      <h1>Edunancial US Platform</h1>

      <p>
        This is the global routing engine for founders entering the US system.
      </p>

      <h2>What we do</h2>
      <ul>
        <li>Business formation</li>
        <li>Banking-ready structures</li>
        <li>Investor-ready entities</li>
        <li>Cross-border routing</li>
      </ul>

      <h2>Start</h2>
      <ul>
        <li><Link href="/us/start">Start your company</Link></li>
        <li><Link href="/us/how-it-works">How it works</Link></li>
        <li><Link href="/us/courses">Courses</Link></li>
        <li><Link href="/us/regions">Global expansion</Link></li>
      </ul>
    </main>
  );
}
