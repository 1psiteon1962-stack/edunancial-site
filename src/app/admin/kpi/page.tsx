import { supabaseAdmin } from "@/lib/kpi/supabaseAdmin";

export default async function AdminKpiPage() {
  const query = supabaseAdmin
    .from("kpi_events")
    .select();

  const { data, error } = await query;

  if (error) {
    return (
      <div>
        <h1>KPI Dashboard</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  const limitedData = Array.isArray(data) ? data.slice(0, 50) : [];

  return (
    <div>
      <h1>KPI Dashboard</h1>

      <pre style={{ fontSize: "12px", overflow: "auto" }}>
        {JSON.stringify(limitedData, null, 2)}
      </pre>
    </div>
  );
}
