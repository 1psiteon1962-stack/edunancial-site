import { US_KPI } from "@/data/kpi/us.kpi";

export default function MetricsPage() {
  return (
    <main className="max-w-6xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold">Founder & Platform Metrics</h1>

      <p className="mt-4 text-lg">
        These KPIs are what investors and capital partners use to evaluate whether 
        a business is real, scalable, and fundable.
      </p>

      <ul className="mt-8 list-disc pl-6 text-lg">
        {US_KPI.track.map(metric => (
          <li key={metric}>{metric}</li>
        ))}
      </ul>
    </main>
  );
}
