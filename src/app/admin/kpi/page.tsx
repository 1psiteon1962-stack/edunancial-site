import { supabaseAdmin } from "@/lib/kpi/supabaseAdmin";

export default async function AdminKpiPage() {
  // ✅ FIX: build query first, THEN await (no chaining after Promise)
  const query = supabaseAdmin
    .from("kpi_events")
    .select();

  const { data, error } = await query;

  if (error) {
    return (
      <div>
        <h1>KPI Dashboard</h1>
        <p>Error loading data</p>
      </div>
    );
  }

  // Optional: manually limit results (since mock client doesn't support .limit)
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
