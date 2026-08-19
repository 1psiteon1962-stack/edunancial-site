"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type State = "ACTIVE" | "PRIVATE" | "BETA" | "DISABLED";
type Country = { countryCode: string; countryName: string; regionCode: string; configuredState: State; launchState: State; runtimeOverride: boolean; reason: string | null; updatedBy: string | null; updatedAt: string | null };

function csrf() {
  return document.cookie.split("; ").find((row) => row.startsWith("edunancial_admin_csrf="))?.split("=")[1] ?? "";
}

export default function CountryLaunchControlsClient() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [message, setMessage] = useState("Loading country controls…");
  const [saving, setSaving] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/admin/regions/countries", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Unable to load country controls.");
    setCountries(data.countries ?? []);
    setMessage("");
  }

  useEffect(() => { load().catch((error) => setMessage(error.message)); }, []);

  async function change(country: Country, launchState: State) {
    setSaving(country.countryCode);
    setMessage("");
    try {
      const response = await fetch("/api/admin/regions/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrf() },
        body: JSON.stringify({ countryCode: country.countryCode, launchState, reason: "Changed from executive regional controls" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Country update failed.");
      await load();
      setMessage(`${country.countryName} is now ${launchState}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Country update failed.");
    } finally { setSaving(null); }
  }

  return <main className="min-h-screen bg-[#08101f] text-white"><div className="mx-auto max-w-7xl px-6 py-10">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">Executive Controls</p><h1 className="mt-3 text-4xl font-black">Country Launch Controls</h1><p className="mt-2 max-w-3xl text-slate-400">Turn individual countries on, private, beta, or fully disabled without editing source code. Runtime overrides are recorded separately from the canonical regional architecture.</p></div><Link href="/admin/dashboard" className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold">← KPI Dashboard</Link></div>
    {message && <div className="mt-6 rounded-xl border border-white/10 bg-[#101a2f] px-5 py-4 text-sm">{message}</div>}
    <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-[#101a2f]"><table className="w-full text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase text-slate-400"><tr><th className="p-4">Country</th><th className="p-4">Region</th><th className="p-4">Current</th><th className="p-4">Source</th><th className="p-4">Control</th></tr></thead><tbody>{countries.map((country) => <tr key={country.countryCode} className="border-b border-white/5"><td className="p-4"><b>{country.countryName}</b><div className="text-xs text-slate-500">{country.countryCode}</div></td><td className="p-4 text-slate-300">{country.regionCode}</td><td className="p-4 font-bold">{country.launchState}</td><td className="p-4 text-xs text-slate-400">{country.runtimeOverride ? "Runtime override" : "Canonical default"}</td><td className="p-4"><select value={country.launchState} disabled={saving === country.countryCode} onChange={(event) => change(country, event.target.value as State)} className="rounded-lg border border-white/10 bg-[#08101f] px-3 py-2"><option value="ACTIVE">ACTIVE</option><option value="BETA">BETA</option><option value="PRIVATE">PRIVATE</option><option value="DISABLED">DISABLED</option></select></td></tr>)}</tbody></table></div>
    <div className="mt-6 rounded-xl border border-yellow-700/30 bg-yellow-950/20 p-5 text-sm text-yellow-100"><b>Safety rule:</b> ACTIVE is an explicit administrative decision. PRIVATE keeps a country staged, BETA allows controlled rollout, and DISABLED is the emergency cutoff state.</div>
  </div></main>;
}
