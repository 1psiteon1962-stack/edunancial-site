import { getMetrics } from "@/lib/investorMetrics";

export default function InvestorDashboard() {
  const metrics = getMetrics();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Investor Metrics</h1>

      <p><strong>Total Revenue:</strong> ${metrics.totalRevenue.toFixed(2)}</p>
      <p><strong>Total Sales:</strong> {metrics.totalSales}</p>
      <p><strong>ARPU:</strong> ${metrics.arpu.toFixed(2)}</p>

      <h3>By Region</h3>
      <ul>
        {Object.entries(metrics.revenueByRegion).map(([r, v]) => (
          <li key={r}>{r}: ${v.toFixed(2)}</li>
        ))}
      </ul>
    </main>
  );
}
