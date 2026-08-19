import { requireAdminPageSession } from "@/lib/admin-content/auth";
import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";

export const metadata = { title: "Analytics & KPIs | Edunancial Admin" };

export default async function AdminKpiPage() {
  await requireAdminPageSession();

  try {
    const supabase = getKpiSupabaseAdmin();
    const { data, error } = await supabase.from("kpi_events").select("*").limit(50);

    if (error) {
      return <main className="min-h-screen bg-[#08101f] px-6 py-10 text-white"><div className="mx-auto max-w-7xl"><h1 className="text-3xl font-black">Analytics & KPIs</h1><div className="mt-6 rounded-xl border border-amber-700/40 bg-amber-950/20 p-5 text-amber-200">KPI data source is connected, but the current query could not be completed.</div></div></main>;
    }

    const rows = Array.isArray(data) ? data : [];
    return <main className="min-h-screen bg-[#08101f] px-6 py-10 text-white"><div className="mx-auto max-w-7xl"><h1 className="text-3xl font-black">Analytics & KPIs</h1><p className="mt-2 text-slate-400">Authoritative KPI event feed. Executive rollups are calculated from connected production sources.</p>{rows.length === 0 ? <div className="mt-6 rounded-xl border border-white/10 bg-[#101a2f] p-5 text-slate-300">No KPI events are available yet. This is intentionally not displayed as zero activity.</div> : <div className="mt-6 overflow-auto rounded-xl border border-white/10 bg-[#101a2f] p-5"><pre className="text-xs text-slate-300">{JSON.stringify(rows, null, 2)}</pre></div>}</div></main>;
  } catch {
    return <main className="min-h-screen bg-[#08101f] px-6 py-10 text-white"><div className="mx-auto max-w-7xl"><h1 className="text-3xl font-black">Analytics & KPIs</h1><div className="mt-6 rounded-xl border border-red-800/40 bg-red-950/20 p-5 text-red-200">KPI data source unavailable. Configure the authoritative server-side data connection before relying on these metrics.</div></div></main>;
  }
}
