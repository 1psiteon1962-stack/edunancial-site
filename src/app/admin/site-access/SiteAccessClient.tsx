"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type State = "OPEN" | "BLOCKED";
type Location = {
  code: string;
  name: string;
  kind: "country" | "region";
  state: State;
  defaultState: State;
  sanctionsNote: string | null;
  planReason: string;
  planReasonCode: string;
  waitingForLanguage: string | null;
  priceTier: string;
  ownerDecision: boolean;
  reason: string | null;
  updatedBy: string | null;
  updatedAt: string | null;
};

function csrf() {
  return document.cookie.split("; ").find((row) => row.startsWith("edunancial_admin_csrf="))?.split("=")[1] ?? "";
}

export default function SiteAccessClient() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "blocked" | "sanctions">("all");
  const [reasonFilter, setReasonFilter] = useState<string>("any");
  const [message, setMessage] = useState("Loading…");
  const [saving, setSaving] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/admin/site-access", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Unable to load website access controls.");
    setLocations(data.locations ?? []);
    setMessage("");
  }

  useEffect(() => { load().catch((error) => setMessage(error.message)); }, []);

  async function change(location: Location, state: State) {
    let confirm = "";
    let reason = "";
    if (state === "OPEN" && location.sanctionsNote) {
      const typed = window.prompt(
        `${location.name} is blocked because of U.S. sanctions:\n${location.sanctionsNote}\n\nOnly open it if U.S. policy now allows it. Type OPEN ${location.code} to confirm.`,
      );
      if (typed === null) return;
      confirm = typed;
      reason = window.prompt("Reason (for example, the U.S. policy change and its date):") ?? "";
      if (!reason.trim()) { setMessage("A reason is required to open a sanctioned location."); return; }
    } else {
      reason = window.prompt(`Reason for setting ${location.name} to ${state} (optional):`) ?? "";
    }
    setSaving(location.code);
    setMessage("");
    try {
      const response = await fetch("/api/admin/site-access", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrf() },
        body: JSON.stringify({ code: location.code, state, reason, confirm }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(response.status === 403 ? "Only the owner can change website access. Sign in through the executive owner login." : data.error ?? "Update failed.");
      }
      await load();
      setMessage(`${location.name} is now ${state}. Takes effect within about a minute.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed.");
    } finally { setSaving(null); }
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return locations
      .filter((l) => filter === "all" || (filter === "blocked" ? l.state === "BLOCKED" : filter === "open" ? l.state === "OPEN" : Boolean(l.sanctionsNote)))
      .filter((l) => reasonFilter === "any" || (reasonFilter === "OWNER" ? l.ownerDecision : l.planReasonCode === reasonFilter))
      .filter((l) => !q || l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q));
  }, [locations, query, filter, reasonFilter]);

  const blockedCount = locations.filter((l) => l.state === "BLOCKED").length;
  const openCount = locations.filter((l) => l.state === "OPEN" && l.kind === "country").length;
  const countBy = (code: string) => locations.filter((l) => l.kind === "country" && l.planReasonCode === code).length;
  const REASONS: [string, string][] = [
    ["any", "Any reason"],
    ["LANGUAGE_READY", "Language ready"],
    ["ENGLISH_APPROVED", "English approved"],
    ["WAITING_FOR_LANGUAGE", "Waiting for language"],
    ["NOT_YET_SERVED", "Not yet served"],
    ["LEGAL_BLOCK", "Legal block (sanctions)"],
    ["OWNER_POLITICAL_BLOCK", "Owner political block"],
    ["OWNER", "Changed by owner"],
  ];

  return <main className="min-h-screen bg-[#08101f] text-white"><div className="mx-auto max-w-6xl px-6 py-10">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">Owner Controls</p>
        <h1 className="mt-3 text-4xl font-black">Website Access by Country</h1>
        <p className="mt-2 max-w-3xl text-slate-400">BLOCKED locations cannot open any page of edunancial.com. OPEN locations can visit; whether they can buy is set separately on Country Launch Controls.</p>
      </div>
      <div className="flex gap-2">
        <Link href="/admin/regions" className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold">Sales by country →</Link>
      </div>
    </div>

    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[["Countries ON", openCount, "text-emerald-400"], ["Waiting for language", countBy("WAITING_FOR_LANGUAGE"), "text-yellow-300"], ["Not yet served", countBy("NOT_YET_SERVED"), "text-slate-300"], ["Blocked (all reasons)", blockedCount, "text-red-400"]].map(([label, value, color]) => (
        <div key={String(label)} className="rounded-xl border border-white/10 bg-[#101a2f] p-4"><div className="text-xs uppercase text-slate-400">{label}</div><div className={`mt-1 text-3xl font-black ${color}`}>{value}</div></div>
      ))}
    </div>

    <div className="mt-6 flex flex-wrap items-center gap-3">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search country" className="min-w-[220px] flex-1 rounded-lg border border-white/10 bg-[#101a2f] px-4 py-3" />
      {(["all", "open", "blocked", "sanctions"] as const).map((key) => (
        <button key={key} onClick={() => setFilter(key)} className={`rounded-lg px-4 py-3 text-sm font-bold ${filter === key ? "bg-yellow-400 text-black" : "border border-white/10 bg-[#101a2f]"}`}>
          {key === "blocked" ? `Blocked (${blockedCount})` : key === "open" ? `On (${openCount})` : key === "sanctions" ? "U.S. sanctions list" : `All (${locations.length})`}
        </button>
      ))}
      <select value={reasonFilter} onChange={(e) => setReasonFilter(e.target.value)} className="rounded-lg border border-white/10 bg-[#101a2f] px-4 py-3 text-sm font-bold">
        {REASONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </div>

    {message && <div className="mt-6 rounded-xl border border-white/10 bg-[#101a2f] px-5 py-4 text-sm">{message}</div>}

    <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-[#101a2f]"><table className="w-full text-left text-sm">
      <thead className="border-b border-white/10 text-xs uppercase text-slate-400"><tr><th className="p-4">Location</th><th className="p-4">Access</th><th className="p-4">Why</th><th className="p-4">Price tier</th><th className="p-4">Change</th></tr></thead>
      <tbody>{visible.map((l) => <tr key={l.code} className="border-b border-white/5">
        <td className="p-4"><b>{l.name}</b><div className="text-xs text-slate-500">{l.code}{l.kind === "region" ? " · region" : ""}</div></td>
        <td className={`p-4 font-black ${l.state === "BLOCKED" ? "text-red-400" : "text-emerald-400"}`}>{l.state}</td>
        <td className="p-4 text-xs text-slate-400">
          {l.ownerDecision ? <>Owner decision{l.updatedAt ? ` · ${new Date(l.updatedAt).toLocaleDateString()}` : ""}{l.reason ? ` · ${l.reason}` : ""}<div className="mt-1 text-slate-500">Plan default: {l.planReason}</div></> : l.sanctionsNote ?? l.planReason}
          {l.ownerDecision && l.sanctionsNote && <div className="mt-1 text-yellow-300">Default: {l.sanctionsNote}</div>}
        </td>
        <td className="p-4 text-xs font-bold text-slate-300">{l.priceTier === "FULL" ? "Full" : l.priceTier === "REDUCED" ? "Reduced" : l.priceTier === "FORMULA" ? "Formula" : l.priceTier}</td>
        <td className="p-4">
          <button disabled={saving === l.code} onClick={() => change(l, l.state === "BLOCKED" ? "OPEN" : "BLOCKED")}
            className={`rounded-lg px-4 py-2 text-sm font-bold ${l.state === "BLOCKED" ? "bg-emerald-600" : "bg-red-700"} disabled:opacity-50`}>
            {saving === l.code ? "Saving…" : l.state === "BLOCKED" ? "Open" : "Block"}
          </button>
        </td>
      </tr>)}</tbody>
    </table></div>

    <div className="mt-6 rounded-xl border border-yellow-700/30 bg-yellow-950/20 p-5 text-sm text-yellow-100">
      <b>Plan defaults:</b> a country is ON when its language is built or you approved English; other countries stay OFF until you decide. Yemen is blocked by your choice. Your switch on any row overrides the plan. <b>Legal defaults:</b> Cuba, Iran, North Korea, and the Crimea, Sevastopol, Donetsk and Luhansk regions of Ukraine are blocked because they are under comprehensive U.S. (OFAC) embargo. Every change is recorded with your name, date and reason. Opening a sanctioned location requires typed confirmation.
    </div>
  </div></main>;
}
