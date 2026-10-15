import { requireAdminPageSession } from "@/lib/admin-content/auth";
import { listRecentKpiEvents } from "@/lib/kpi/repository";

export const metadata = { title: "Analytics & KPIs | Edunancial Admin" };

type EventRow = {
  id?: string | number;
  created_at?: string | Date;
  event_name?: string;
  path?: string | null;
  metadata?: unknown;
};

function visitorCountry(row: EventRow): string {
  const metadata = row.metadata;
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return "Unknown";
  const code = (metadata as Record<string, unknown>).visitor_country_code;
  return typeof code === "string" && /^[A-Z]{2}$/.test(code) ? code : "Unknown";
}

export default async function AdminKpiPage() {
  await requireAdminPageSession();

  try {
    const data = await listRecentKpiEvents(200);
    const rows = (Array.isArray(data) ? data : []) as EventRow[];
    const pageViews = rows.filter((row) => row.event_name === "page_view");
    const byCountry = new Map<string, number>();
    for (const row of pageViews) {
      const country = visitorCountry(row);
      byCountry.set(country, (byCountry.get(country) ?? 0) + 1);
    }
    const countryCounts = [...byCountry.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

    return (
      <main className="min-h-screen bg-[#08101f] px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-black">Analytics & KPIs</h1>
          <p className="mt-2 text-slate-400">
            Recent persisted events. This report covers the latest 200 events, not all-time traffic.
            Country is derived from server-detected network geography, not visitor-entered information.
          </p>
          {rows.length === 0 ? (
            <div className="mt-6 rounded-xl border border-white/10 bg-[#101a2f] p-5 text-slate-300">
              No KPI events are available yet. This is intentionally not displayed as zero activity.
            </div>
          ) : (
            <>
              <section className="mt-6 rounded-xl border border-white/10 bg-[#101a2f] p-5">
                <h2 className="text-xl font-bold">Page views by country</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {pageViews.length} page-view events within {rows.length} recent records.
                  Unknown means the hosting network did not provide a usable country.
                </p>
                {countryCounts.length ? (
                  <table className="mt-4 w-full text-left text-sm">
                    <thead><tr className="border-b border-white/20"><th className="py-2">Country code</th><th className="py-2 text-right">Page views</th></tr></thead>
                    <tbody>{countryCounts.map(([country, count]) => (
                      <tr className="border-b border-white/10" key={country}>
                        <td className="py-2">{country === "DO" ? "DO - Dominican Republic" : country}</td>
                        <td className="py-2 text-right">{count}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                ) : <p className="mt-4 text-slate-400">No page views in the recent sample.</p>}
              </section>
              <section className="mt-6 overflow-auto rounded-xl border border-white/10 bg-[#101a2f] p-5">
                <h2 className="mb-4 text-xl font-bold">Recent events</h2>
                <table className="w-full text-left text-xs">
                  <thead><tr className="border-b border-white/20"><th className="p-2">Time (UTC)</th><th className="p-2">Event</th><th className="p-2">Country</th><th className="p-2">Path</th></tr></thead>
                  <tbody>{rows.map((row, index) => (
                    <tr className="border-b border-white/10" key={String(row.id ?? index)}>
                      <td className="p-2 whitespace-nowrap">{row.created_at ? new Date(row.created_at).toISOString() : "Unknown"}</td>
                      <td className="p-2">{row.event_name ?? "Unknown"}</td>
                      <td className="p-2">{visitorCountry(row)}</td>
                      <td className="p-2 break-all">{row.path ?? "-"}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </section>
            </>
          )}
        </div>
      </main>
    );
  } catch {
    return (
      <main className="min-h-screen bg-[#08101f] px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-black">Analytics & KPIs</h1>
          <div className="mt-6 rounded-xl border border-red-800/40 bg-red-950/20 p-5 text-red-200">
            KPI data source unavailable. Configure the authoritative server-side data connection before relying on these metrics.
          </div>
        </div>
      </main>
    );
  }
}
