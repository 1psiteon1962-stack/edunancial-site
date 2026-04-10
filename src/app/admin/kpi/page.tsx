import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/kpi/supabaseAdmin";
import { getSiteContext } from "@/lib/kpi/site";
import { redirect } from "next/navigation";

export default async function AdminKpiPage() {
  const headersList = headers();

  // Basic auth check (adjust later if needed)
  const authHeader = headersList.get("authorization");
  if (!authHeader) {
    redirect("/");
  }

  // ✅ FIX: pass required argument to getSiteContext
  const context = await getSiteContext({
    headers: headersList,
    supabase: supabaseAdmin,
  });

  // Safe query fallback
  const { data, error } = await supabaseAdmin
    .from("kpi_events")
    .select("*")
    .limit(50);

  if (error) {
    console.error("KPI fetch error:", error);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin KPI Dashboard</h1>

      <p>
        <strong>Region:</strong> {context?.region || "unknown"}
      </p>

      <h2>Recent Events</h2>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: "10px",
          overflowX: "auto",
        }}
      >
        {JSON.stringify(data || [], null, 2)}
      </pre>
    </div>
  );
}
