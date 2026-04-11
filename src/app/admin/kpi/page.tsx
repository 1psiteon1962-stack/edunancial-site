import { supabaseAdmin } from "@/lib/kpi/supabaseAdmin";

export default async function AdminKpiPage() {
  const { data, error } = await supabaseAdmin
    .from("kpi_events")
    .select() // ✅ FIXED: removed "*"
    .limit(50);

  if (error) {
    return (
      <div>
        <h1>KPI Dashboard</h1>
        <p>Error loading data</p>
      </div>
    );
  }

  return (
    <div>
      <h1>KPI Dashboard</h1>

      <pre style={{ fontSize: "12px", overflow: "auto" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
