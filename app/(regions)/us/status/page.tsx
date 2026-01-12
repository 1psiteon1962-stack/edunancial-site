import { getFounderLevel } from "../level-engine";

export default function StatusPage() {
  const demoFounder = {
    revenue: 45000,
    hasEmployees: false,
    hasHoldingCompany: false,
  };

  const level = getFounderLevel(demoFounder);

  return (
    <main style={{ padding: "40px" }}>
      <h1>Your Founder Status</h1>
      <p>Based on your inputs:</p>

      <ul>
        <li>Revenue: ${demoFounder.revenue}</li>
        <li>Employees: {demoFounder.hasEmployees ? "Yes" : "No"}</li>
        <li>Holding Company: {demoFounder.hasHoldingCompany ? "Yes" : "No"}</li>
      </ul>

      <h2>You are currently Level {level}</h2>

      <p>
        Your next milestone is Level {level + 1}.
      </p>

      <a href={`/us/l${level}`}>Go to your level</a>
    </main>
  );
}
