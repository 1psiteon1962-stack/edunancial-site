import { headers } from "next/headers";
import { supabaseAdmin } from "../../lib/kpi/supabaseAdmin";
import { getSiteContext } from "../../lib/kpi/site";

function unauthorized() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Unauthorized</h1>
      <p>Missing or invalid admin credentials.</p>
    </main>
  );
}

export default async function AdminKPIPage() {
  const h = await headers();
  const auth = h.get("authorization") || "";

  const user = process.env.ADMIN_DASH_USER || "";
  const pass = process.env.ADMIN_DASH_PASS || "";
  const expected = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");

  if (!user || !pass || auth !== expected) return unauthorized();

  const { site_id } = getSiteContext();

  const { data: recent, error } = await supabaseAdmin
    .from("kpi_events")
    .select("occurred_at,event_name,pathname,product_sku,price,currency,utm_source,utm_medium,utm_campaign")
    .eq("site_id", site_id)
    .order("occurred_at", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>KPI Dashboard</h1>
        <p>Error: {error.message}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>KPI Dashboard — {site_id}</h1>
      <p>Last 50 events</p>

      <div style={{ overflowX: "auto" }}>
        <table cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th align="left">Time</th>
              <th align="left">Event</th>
              <th align="left">Path</th>
              <th align="left">SKU</th>
              <th align="left">Price</th>
              <th align="left">UTM</th>
            </tr>
          </thead>
          <tbody>
            {(recent || []).map((e: any, i: number) => (
              <tr key={i}>
                <td>{new Date(e.occurred_at).toLocaleString()}</td>
                <td>{e.event_name}</td>
                <td>{e.pathname || ""}</td>
                <td>{e.product_sku || ""}</td>
                <td>{e.price ? `${e.price} ${e.currency || ""}` : ""}</td>
                <td>
                  {[e.utm_source, e.utm_medium, e.utm_campaign].filter(Boolean).join(" / ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
