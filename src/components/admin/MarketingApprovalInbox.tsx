"use client";

import { useState } from "react";

type Item = { id: string; platform: string; format: string; copy: string; scheduledFor: string | null; campaign: string; locale: string; status: string };

function csrfToken() {
  const match = document.cookie.match(/(?:^|; )edunancial_admin_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]!) : "";
}

/** Default schedule: tomorrow 09:00 in the owner's local time, as a datetime-local value. */
function defaultWhen() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Owner approval inbox. Nothing publishes unless approved AND scheduled here;
 * the scheduler only sends scheduled items to connected accounts.
 */
export default function MarketingApprovalInbox({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);
  const [when, setWhen] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function act(id: string, action: "approve" | "cancel" | "schedule") {
    setBusy(id);
    setMessage("");
    try {
      const local = when[id] ?? defaultWhen();
      const body = action === "schedule" ? JSON.stringify({ scheduledFor: new Date(local).toISOString() }) : "{}";
      const res = await fetch(`/api/admin/marketing/publications/${id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken() },
        body,
      });
      const payload = (await res.json().catch(() => ({}))) as { status?: string; scheduledFor?: string; error?: string };
      if (!res.ok) {
        setMessage(payload.error ?? `Action failed (HTTP ${res.status}).`);
        return;
      }
      setItems((current) =>
        action === "cancel"
          ? current.filter((item) => item.id !== id)
          : current.map((item) => (item.id === id ? { ...item, status: payload.status ?? item.status, scheduledFor: payload.scheduledFor ?? item.scheduledFor } : item)),
      );
    } catch {
      setMessage("Network error. Nothing was changed.");
    } finally {
      setBusy(null);
    }
  }

  async function approveAll() {
    for (const item of items.filter((i) => i.status === "review")) await act(item.id, "approve");
  }

  const reviewCount = items.filter((i) => i.status === "review").length;
  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={!reviewCount || busy !== null} onClick={approveAll} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold disabled:opacity-40">
          Approve all in review ({reviewCount})
        </button>
        {message ? <p className="text-sm text-amber-200">{message}</p> : null}
      </div>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? <p className="py-8 text-slate-400">No marketing publications are waiting.</p> : null}
        {items.map((item) => (
          <article key={item.id} className="rounded-xl bg-black/20 p-4">
            <div className="flex flex-wrap gap-3 text-xs font-bold uppercase text-blue-300">
              <span>{item.status}</span><span>{item.platform}</span><span>{item.locale}</span><span>{item.campaign}</span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-200">{item.copy}</p>
            {item.scheduledFor ? <p className="mt-2 text-xs text-slate-400">Scheduled {new Date(item.scheduledFor).toLocaleString()}</p> : null}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              {item.status === "review" || item.status === "failed" ? (
                <button type="button" disabled={busy === item.id} onClick={() => act(item.id, "approve")} className="rounded-lg bg-emerald-600 px-3 py-1.5 font-bold disabled:opacity-40">Approve</button>
              ) : null}
              {item.status === "approved" ? (
                <>
                  <input type="datetime-local" value={when[item.id] ?? defaultWhen()} onChange={(e) => setWhen((w) => ({ ...w, [item.id]: e.target.value }))} className="rounded-lg bg-[#101a2f] px-2 py-1.5" />
                  <button type="button" disabled={busy === item.id} onClick={() => act(item.id, "schedule")} className="rounded-lg bg-blue-600 px-3 py-1.5 font-bold disabled:opacity-40">Schedule</button>
                </>
              ) : null}
              <button type="button" disabled={busy === item.id} onClick={() => act(item.id, "cancel")} className="rounded-lg border border-red-400/40 px-3 py-1.5 font-bold text-red-200 disabled:opacity-40">Reject</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
