import MetricsDashboard from "@/app/components/MetricsDashboard";

export const dynamic = "error";

export default function Page() {
  return (
    <main style={{ padding: "2rem", maxWidth: 980, margin: "auto" }}>
      <h1>Edunancial — Metrics</h1>
      <MetricsDashboard />
    </main>
  );
}
