import MetricsDashboard from "../components/MetricsDashboard";

export default function MetricsPage() {
  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "18px 14px" }}>
      <h1 style={{ fontSize: 30, marginBottom: 6 }}>Metrics</h1>
      <p style={{ marginTop: 0, opacity: 0.85 }}>
        KPI proof layer: conversions, revenue modeling, churn tracking.
      </p>
      <MetricsDashboard />
    </main>
  );
}
