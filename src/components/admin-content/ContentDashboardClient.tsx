"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { BatchSummary } from "@/lib/admin-content/types";

export default function ContentDashboardClient() {
  const [batches, setBatches] = useState<BatchSummary[]>([]);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    void (async () => {
      const sessionResponse = await fetch("/api/admin/auth/session", { cache: "no-store" });
      const sessionPayload = await sessionResponse.json();
      setCsrfToken(sessionPayload.csrfToken ?? "");
      const batchesResponse = await fetch("/api/admin/content/batches", { cache: "no-store" });
      const batchesPayload = await batchesResponse.json();
      setBatches(batchesPayload.batches ?? []);
    })();
  }, []);

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST", headers: { "x-csrf-token": csrfToken } });
    window.location.href = "/admin/login";
  }

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Admin content workspace</p>
            <h1 className="mt-3 text-4xl font-black">Upload & Review Portal</h1>
            <p className="mt-3 max-w-3xl text-slate-300">Securely upload content batches, inspect extracted files, review destinations, and prepare a GitHub-ready package without publishing automatically.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/content/upload" className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500">Upload content</Link>
            <button onClick={logout} className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-slate-200 hover:border-white/30">Logout</button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <StatCard label="Batches" value={String(batches.length)} />
          <StatCard label="Pending files" value={String(batches.reduce((sum, batch) => sum + batch.pendingFiles, 0))} />
          <StatCard label="Approved files" value={String(batches.reduce((sum, batch) => sum + batch.approvedFiles, 0))} />
          <StatCard label="Conflicts" value={String(batches.reduce((sum, batch) => sum + batch.conflicts, 0))} />
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#101a2f]">
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-4 border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.25em] text-slate-400">
            <span>Batch</span>
            <span>Status</span>
            <span>Files</span>
            <span>Source</span>
            <span>Review</span>
          </div>
          {batches.length === 0 ? (
            <div className="px-5 py-10 text-slate-300">No upload batches yet.</div>
          ) : (
            batches.map((batch) => (
              <div key={batch.id} className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-4 border-b border-white/5 px-5 py-4 text-sm text-slate-200 last:border-b-0">
                <div>
                  <p className="font-semibold text-white">{batch.name}</p>
                  <p className="mt-1 text-xs text-slate-400">{batch.createdAt}</p>
                </div>
                <span>{batch.status}</span>
                <span>{batch.totalFiles}</span>
                <span>{batch.source}</span>
                <Link href={`/admin/content/batches/${batch.id}`} className="font-semibold text-blue-300 hover:text-blue-200">Open batch</Link>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#101a2f] p-5">
      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  );
}
