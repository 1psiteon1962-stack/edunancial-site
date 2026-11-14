"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function csrf() {
  return document.cookie.split("; ").find((row) => row.startsWith("edunancial_admin_csrf="))?.split("=")[1] ?? "";
}

export default function ReportsClient() {
  const [dates, setDates] = useState<string[]>([]);
  const [report, setReport] = useState<string | null>(null);
  const [message, setMessage] = useState("Loading…");
  const [busy, setBusy] = useState(false);

  async function load(date?: string) {
    const response = await fetch(`/api/admin/reports/weekly${date ? `?date=${date}` : ""}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Unable to load reports.");
    setDates(data.dates ?? []);
    setReport(data.report ?? null);
    setMessage(data.report ? "" : "No reports yet. The first one arrives Monday at 7 a.m. Pacific, or generate one now.");
  }

  useEffect(() => { load().catch((e) => setMessage(e.message)); }, []);

  async function generate() {
    setBusy(true);
    setMessage("Building report…");
    try {
      const response = await fetch("/api/admin/reports/weekly", { method: "POST", headers: { "x-csrf-token": csrf() } });
      const data = await response.json();
      if (!response.ok) throw new Error(response.status === 403 ? "Only the owner can generate reports." : data.error ?? "Failed.");
      setReport(data.report);
      await load();
      setMessage("");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed.");
    } finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-[#08101f] text-white"><div className="mx-auto max-w-4xl px-6 py-10">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">Owner Reports</p>
        <h1 className="mt-3 text-4xl font-black">Weekly Report</h1>
        <p className="mt-2 text-slate-400">Every Monday 7 a.m. Pacific. Also posted to GitHub, which emails you.</p>
      </div>
      <div className="flex gap-2">
        <Link href="/admin/kpi" className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold">Live numbers →</Link>
        <button onClick={generate} disabled={busy} className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-black disabled:opacity-50">{busy ? "Building…" : "Generate now"}</button>
      </div>
    </div>
    {dates.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{dates.map((d) => (
      <button key={d} onClick={() => load(d).catch((e) => setMessage(e.message))} className="rounded border border-white/10 bg-[#101a2f] px-3 py-1 text-xs">{d}</button>
    ))}</div>}
    {message && <div className="mt-6 rounded-xl border border-white/10 bg-[#101a2f] px-5 py-4 text-sm">{message}</div>}
    {report && <pre className="mt-6 whitespace-pre-wrap rounded-2xl border border-white/10 bg-[#101a2f] p-6 text-sm leading-6">{report}</pre>}
  </div></main>;
}
