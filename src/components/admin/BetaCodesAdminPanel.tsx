"use client";

import { useCallback, useEffect, useState } from "react";

interface CodeRow {
  id: string;
  code_hint: string;
  batch_label: string | null;
  status: "issued" | "redeemed" | "revoked";
  issued_at: string;
  redeemed_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
}
interface Summary { issued: number; unredeemed: number; activeRedeemed: number; expired: number; revoked: number }

function csrfToken() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|; )edunancial_admin_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

const fmt = (value: string | null) => (value ? new Date(value).toLocaleString() : "—");

export default function BetaCodesAdminPanel() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [codes, setCodes] = useState<CodeRow[]>([]);
  const [fresh, setFresh] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/beta-codes", { cache: "no-store" });
    const json = await response.json();
    if (!response.ok) { setMessage(json.error ?? "Unable to load codes."); return; }
    setSummary(json.summary);
    setCodes(json.codes);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function issue() {
    setBusy(true); setMessage(""); setFresh([]);
    const response = await fetch("/api/admin/beta-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken() },
      body: JSON.stringify({ count, batchLabel: label }),
    });
    const json = await response.json();
    setBusy(false);
    if (!response.ok) { setMessage(json.error ?? "Issuance failed."); return; }
    setFresh((json.codes as { code: string | null }[]).map((c) => c.code).filter((c): c is string => Boolean(c)));
    setMessage(json.warning);
    void load();
  }

  async function act(codeId: string, action: "revoke" | "extend") {
    const days = action === "extend" ? Number(window.prompt("Extend by how many days? (1–180)", "30")) : undefined;
    if (action === "extend" && !days) return;
    if (action === "revoke" && !window.confirm("Revoke this code? A redeemed tester loses beta access immediately. Paid memberships are not affected.")) return;
    const response = await fetch("/api/admin/beta-codes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken() },
      body: JSON.stringify({ codeId, action, days }),
    });
    const json = await response.json();
    setMessage(response.ok ? `Code ${action === "revoke" ? "revoked" : "extended"}.` : json.error ?? "Action failed.");
    void load();
  }

  return (
    <section className="mx-auto mt-10 max-w-5xl rounded-2xl border border-yellow-600/40 bg-slate-900/60 p-6">
      <h2 className="text-2xl font-bold">Alpha/Beta Access Codes</h2>
      <p className="mt-1 text-sm text-slate-400">Each code: one redemption, 90-day Gold-equivalent access (all colors, Levels 1–5, all languages). Clock starts at redemption. No payment, no subscription.</p>

      {summary && (
        <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-5">
          {[["Issued", summary.issued], ["Unredeemed", summary.unredeemed], ["Active", summary.activeRedeemed], ["Expired", summary.expired], ["Revoked", summary.revoked]].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-slate-700 p-3"><div className="text-2xl font-bold">{v}</div><div className="text-xs text-slate-400">{k}</div></div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <label className="text-sm">Number of codes
          <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(Number(e.target.value))} className="mt-1 block w-28 rounded-lg border border-slate-700 bg-slate-950 p-2" />
        </label>
        <label className="text-sm">Batch label (optional)
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="alpha-oct-2026" className="mt-1 block w-56 rounded-lg border border-slate-700 bg-slate-950 p-2" />
        </label>
        <button onClick={issue} disabled={busy} className="rounded-lg bg-yellow-500 px-4 py-2 font-bold text-slate-950 disabled:opacity-60">{busy ? "Generating…" : "Generate codes"}</button>
      </div>

      {message && <p className="mt-4 rounded-lg border border-slate-600 bg-slate-950 p-3 text-sm">{message}</p>}

      {fresh.length > 0 && (
        <div className="mt-4 rounded-lg border border-green-600 bg-green-950/40 p-4">
          <p className="font-semibold text-green-300">Copy these now — they will not be shown again.</p>
          <pre className="mt-2 select-all whitespace-pre-wrap font-mono text-lg">{fresh.join("\n")}</pre>
          <button onClick={() => void navigator.clipboard.writeText(fresh.join("\n"))} className="mt-2 rounded bg-green-600 px-3 py-1 text-sm font-semibold">Copy all</button>
        </div>
      )}

      <table className="mt-6 w-full text-left text-sm">
        <thead className="text-slate-400"><tr><th>Code (last 4)</th><th>Batch</th><th>Status</th><th>Issued</th><th>Redeemed</th><th>Expires</th><th /></tr></thead>
        <tbody>
          {codes.map((c) => (
            <tr key={c.id} className="border-t border-slate-800">
              <td className="py-2 font-mono">…{c.code_hint}</td><td>{c.batch_label ?? "—"}</td><td>{c.status}</td>
              <td>{fmt(c.issued_at)}</td><td>{fmt(c.redeemed_at)}</td><td>{fmt(c.expires_at)}</td>
              <td className="space-x-2 text-right">
                {c.status === "redeemed" && <button onClick={() => void act(c.id, "extend")} className="text-blue-400 underline">Extend</button>}
                {c.status !== "revoked" && <button onClick={() => void act(c.id, "revoke")} className="text-red-400 underline">Revoke</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}