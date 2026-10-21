"use client";

import { useCallback, useEffect, useState } from "react";

interface CodeRow {
  id: number;
  issuedAt: string | null;
  redeemedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  redeemed: boolean;
}
interface Summary { total: number; available: number; active: number; expired: number; revoked: number }

function csrfToken() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|; )edunancial_admin_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

const fmt = (value: string | null) => (value ? new Date(value).toLocaleString() : "—");
const statusOf = (c: CodeRow) => {
  if (c.revokedAt) return "revoked";
  if (!c.redeemed) return "available";
  return c.expiresAt && new Date(c.expiresAt).getTime() > Date.now() ? "active" : "expired";
};

/** Owner panel for Neon-backed single-use codes. Plaintext codes appear once, right after generation. */
export default function BetaCodesAdminPanel() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [codes, setCodes] = useState<CodeRow[]>([]);
  const [fresh, setFresh] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/beta-codes", { cache: "no-store" });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) { setMessage(json.error ?? "Unable to load codes."); return; }
    setSummary(json.summary);
    setCodes(json.codes);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function issue() {
    if (!window.confirm(`Generate ${count} new single-use codes? They will be shown once.`)) return;
    setBusy(true); setMessage(""); setFresh([]);
    const response = await fetch("/api/admin/beta-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken() },
      body: JSON.stringify({ count }),
    });
    const json = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) { setMessage(json.error ?? "Issuance failed."); return; }
    setFresh(json.codes as string[]);
    setMessage(json.warning);
    void load();
  }

  async function act(codeId: number, action: "revoke" | "extend") {
    const days = action === "extend" ? Number(window.prompt("Extend by how many days? (1–180)", "30")) : undefined;
    if (action === "extend" && !days) return;
    if (action === "revoke" && !window.confirm("Revoke this code? A tester using it loses beta access immediately. Paid memberships are not affected.")) return;
    const response = await fetch("/api/admin/beta-codes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken() },
      body: JSON.stringify({ codeId, action, days }),
    });
    const json = await response.json().catch(() => ({}));
    setMessage(response.ok ? `Code #${codeId} ${action === "revoke" ? "revoked" : "extended"}.` : json.error ?? "Action failed.");
    void load();
  }

  return (
    <section className="mx-auto mt-10 max-w-5xl rounded-2xl border border-yellow-600/40 bg-slate-900/60 p-6">
      <h2 className="text-2xl font-bold">Alpha/Beta Access Codes</h2>
      <p className="mt-1 text-sm text-slate-400">Each code: one redemption, 30 days of Gold-equivalent access (all 8 tracks, Levels 1–5, all languages). The clock starts at redemption. No payment, no subscription.</p>

      {summary && (
        <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-5">
          {([["Total", summary.total], ["Available", summary.available], ["Active", summary.active], ["Expired", summary.expired], ["Revoked", summary.revoked]] as const).map(([k, v]) => (
            <div key={k} className="rounded-lg border border-slate-700 p-3"><div className="text-2xl font-bold">{v}</div><div className="text-xs text-slate-400">{k}</div></div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <label className="text-sm">Number of codes
          <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(Number(e.target.value))} className="mt-1 block w-28 rounded-lg border border-slate-700 bg-slate-950 p-2" />
        </label>
        <button onClick={issue} disabled={busy} className="rounded-lg bg-yellow-500 px-4 py-2 font-bold text-slate-950 disabled:opacity-60">{busy ? "Generating…" : "Generate codes"}</button>
      </div>

      {message && <p className="mt-4 rounded-lg border border-slate-600 bg-slate-950 p-3 text-sm">{message}</p>}

      {fresh.length > 0 && (
        <div className="mt-4 rounded-lg border border-green-600 bg-green-950/40 p-4">
          <p className="font-semibold text-green-300">Copy these now — they will not be shown again.</p>
          <pre className="mt-2 select-all whitespace-pre-wrap font-mono text-base">{fresh.join("\n")}</pre>
          <button onClick={() => void navigator.clipboard.writeText(fresh.join("\n"))} className="mt-2 rounded bg-green-600 px-3 py-1 text-sm font-semibold">Copy all</button>
        </div>
      )}

      <table className="mt-6 w-full text-left text-sm">
        <thead className="text-slate-400"><tr><th>#</th><th>Status</th><th>Issued</th><th>Redeemed</th><th>Expires</th><th /></tr></thead>
        <tbody>
          {codes.map((c) => {
            const status = statusOf(c);
            return (
              <tr key={c.id} className="border-t border-slate-800">
                <td className="py-2 font-mono">{c.id}</td><td>{status}</td>
                <td>{fmt(c.issuedAt)}</td><td>{fmt(c.redeemedAt)}</td><td>{fmt(c.expiresAt)}</td>
                <td className="space-x-2 text-right">
                  {c.redeemed && !c.revokedAt && <button onClick={() => void act(c.id, "extend")} className="text-blue-400 underline">Extend</button>}
                  {!c.revokedAt && <button onClick={() => void act(c.id, "revoke")} className="text-red-400 underline">Revoke</button>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
