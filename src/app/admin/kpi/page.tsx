import Link from "next/link";

import { requireAdminPageSession } from "@/lib/admin-content/auth";
import { listRecentKpiEvents } from "@/lib/kpi/repository";
import { getKpiSummary, type CountRow } from "@/lib/kpi/summary";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics & KPIs | Edunancial Admin" };

const WINDOWS = [7, 30, 90, 365] as const;

let regionNames: Intl.DisplayNames | null = null;
let languageNames: Intl.DisplayNames | null = null;
function countryLabel(code: string) {
  try {
    regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return `${regionNames.of(code) ?? code} (${code})`;
  } catch {
    return code;
  }
}
function languageLabel(code: string) {
  try {
    languageNames ??= new Intl.DisplayNames(["en"], { type: "language" });
    return `${languageNames.of(code) ?? code} (${code})`;
  } catch {
    return code;
  }
}

const n = (value: number) => value.toLocaleString("en-US");
const money = (value: number, currency: string) =>
  value.toLocaleString("en-US", { style: "currency", currency: /^[A-Z]{3}$/u.test(currency) ? currency : "USD" });

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#101a2f] p-5">
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-black">{value}</div>
      {note && <div className="mt-1 text-xs text-slate-500">{note}</div>}
    </div>
  );
}

function Ranked({ title, rows, label = (k: string) => k, empty }: { title: string; rows: CountRow[]; label?: (key: string) => string; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <section className="rounded-xl border border-white/10 bg-[#101a2f] p-5">
      <h2 className="text-lg font-bold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {rows.map((r) => (
            <li key={r.key}>
              <div className="flex justify-between gap-3"><span className="truncate">{label(r.key)}</span><b>{n(r.count)}</b></div>
              <div className="mt-1 h-1.5 rounded bg-white/5"><div className="h-1.5 rounded bg-yellow-400" style={{ width: `${(r.count / max) * 100}%` }} /></div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function AdminKpiPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdminPageSession();
  const params = (await searchParams) ?? {};
  const requested = Number(Array.isArray(params.days) ? params.days[0] : params.days);
  const days = (WINDOWS as readonly number[]).includes(requested) ? requested : 30;

  let summary: Awaited<ReturnType<typeof getKpiSummary>> | null = null;
  let error: string | null = null;
  try {
    summary = await getKpiSummary(days);
  } catch (e) {
    error = e instanceof Error ? e.message : "Analytics are unavailable.";
  }
  const recent = (await listRecentKpiEvents(50).catch(() => [])) as Array<Record<string, unknown>>;

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">Owner Analytics</p>
            <h1 className="mt-2 text-4xl font-black">Your Numbers</h1>
            <p className="mt-2 text-slate-400">Real people only. Robots are counted separately below.</p>
          </div>
          <nav className="flex gap-2">
            {WINDOWS.map((w) => (
              <Link key={w} href={`/admin/kpi?days=${w}`} className={`rounded-lg px-4 py-2 text-sm font-bold ${w === days ? "bg-yellow-400 text-black" : "border border-white/10 bg-[#101a2f]"}`}>
                {w === 365 ? "1 year" : `${w} days`}
              </Link>
            ))}
          </nav>
        </div>

        {error || !summary ? (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-950/30 p-5">{error ?? "Analytics are unavailable."}</div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <Stat label="Visitors today" value={n(summary.totals.visitorsToday)} />
              <Stat label="Visitors 7 days" value={n(summary.totals.visitorsWeek)} />
              <Stat label="Visitors this month" value={n(summary.totals.visitorsMonth)} />
              <Stat label={`Visitors ${days} days`} value={n(summary.totals.visitorsWindow)} note={`${n(summary.totals.pageViewsWindow)} pages viewed`} />
              <Stat label="Signups" value={n(summary.totals.signupsWindow)} note={`last ${days} days`} />
              <Stat label="Lessons started" value={n(summary.totals.lessonStartsWindow)} />
              <Stat label="Lessons completed" value={n(summary.totals.lessonCompletionsWindow)} />
              <Stat label="Robot page views" value={n(summary.totals.robotViewsWindow)} note="excluded from visitors" />
            </div>

            <section className="mt-6 rounded-xl border border-white/10 bg-[#101a2f] p-5">
              <h2 className="text-lg font-bold">Spending</h2>
              {summary.spending.purchases === 0 ? (
                <p className="mt-2 text-sm text-slate-400">No purchases recorded yet. Spending appears here once payments (Square) are connected.</p>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
                  <Stat label="Total spent" value={money(summary.spending.revenue, summary.spending.currency)} />
                  <Stat label="Purchases" value={n(summary.spending.purchases)} />
                  <Stat label="Buyers" value={n(summary.spending.buyers)} />
                  <Stat label="Average purchase" value={money(summary.spending.averagePurchase, summary.spending.currency)} />
                  <Stat label="Average per buyer" value={money(summary.spending.averagePerBuyer, summary.spending.currency)} />
                </div>
              )}
            </section>

            <section className="mt-6 rounded-xl border border-white/10 bg-[#101a2f] p-5">
              <h2 className="text-lg font-bold">Visitors per day</h2>
              {summary.daily.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">No visits in this period.</p>
              ) : (
                <div className="mt-4 flex h-40 items-end gap-1">
                  {summary.daily.map((d) => {
                    const max = Math.max(1, ...summary!.daily.map((x) => x.visitors));
                    return (
                      <div key={d.day} title={`${d.day}: ${d.visitors} visitors, ${d.pageViews} pages, ${d.signups} signups`} className="flex flex-1 flex-col items-center justify-end">
                        <div className="w-full rounded-t bg-yellow-400" style={{ height: `${Math.max(2, (d.visitors / max) * 100)}%` }} />
                      </div>
                    );
                  })}
                </div>
              )}
              {summary.daily.length > 0 && (
                <div className="mt-2 flex justify-between text-xs text-slate-500"><span>{summary.daily[0].day}</span><span>{summary.daily.at(-1)!.day}</span></div>
              )}
            </section>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Ranked title="Countries" rows={summary.countries} label={countryLabel} empty="No country data yet." />
              <Ranked title="Language chosen on the site" rows={summary.siteLanguages} label={languageLabel} empty="Recorded from today onward." />
              <Ranked title="Visitor's device language" rows={summary.deviceLanguages} label={languageLabel} empty="Recorded from today onward." />
              <Ranked title="Where visitors came from" rows={summary.sources} empty="No referral data yet." />
              <Ranked title="Ad and campaign tags (UTM)" rows={summary.campaigns} empty="No tagged campaigns yet." />
              <Ranked title="Device type" rows={summary.devices} empty="Recorded from today onward." />
              <Ranked title="Most viewed pages" rows={summary.pages} empty="No page views yet." />
              <Ranked title="Robots excluded (why)" rows={summary.robotReasons} empty="No robot traffic detected." />
              <section className="rounded-xl border border-white/10 bg-[#101a2f] p-5">
                <h2 className="text-lg font-bold">Top buyers</h2>
                {summary.spending.topBuyers.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">Appears once purchases are recorded.</p>
                ) : (
                  <ul className="mt-3 space-y-1 text-sm">{summary.spending.topBuyers.map((b) => (
                    <li key={b.userId} className="flex justify-between"><span className="truncate">{b.userId}</span><b>{money(b.total, summary!.spending.currency)} · {b.purchases}</b></li>
                  ))}</ul>
                )}
              </section>
            </div>
            <p className="mt-4 text-xs text-slate-500">Generated {new Date(summary.generatedAt).toLocaleString("en-US")}. Visitors = unique people (returning visitors counted once). Country comes from the hosting network, not visitor input.</p>
          </>
        )}

        <details className="mt-8 rounded-xl border border-white/10 bg-[#101a2f] p-5">
          <summary className="cursor-pointer font-bold">Latest 50 raw events</summary>
          <table className="mt-4 w-full text-left text-xs">
            <thead><tr className="border-b border-white/20"><th className="py-2">Time</th><th>Event</th><th>Path</th><th>Country</th><th>Robot</th></tr></thead>
            <tbody>{recent.map((row, i) => {
              const meta = (row.metadata && typeof row.metadata === "object" ? row.metadata : {}) as Record<string, unknown>;
              return (
                <tr key={String(row.id ?? i)} className="border-b border-white/5">
                  <td className="py-1">{row.created_at ? new Date(String(row.created_at)).toLocaleString("en-US") : ""}</td>
                  <td>{String(row.event_name ?? "")}</td>
                  <td className="max-w-xs truncate">{String(row.path ?? "")}</td>
                  <td>{String(meta.visitor_country_code ?? "")}</td>
                  <td>{meta.is_bot ? String(meta.bot_reason ?? "yes") : ""}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </details>
      </div>
    </main>
  );
}
