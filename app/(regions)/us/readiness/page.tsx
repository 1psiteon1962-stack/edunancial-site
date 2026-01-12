import { calculateReadiness } from "./score-engine";

export default function ReadinessPage() {
  const founder = {
    revenue: 45000,
    employees: 0,
    hasLLC: true,
    hasHoldingCompany: false,
  };

  const score = calculateReadiness(founder);

  return (
    <main style={{ padding: "40px" }}>
      <h1>Founder Readiness Score</h1>

      <h2>{score} / 100</h2>

      <p>
        This score reflects how investable your company is based on structure,
        revenue, and legal readiness.
      </p>

      <a href="/us/investor-view">View Investor Snapshot</a>
    </main>
  );
}
