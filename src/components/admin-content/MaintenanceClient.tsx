"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type MaintenanceStats = {
  totalBatches: number;
  failedBatches: number;
  exportedBatches: number;
  totalFiles: number;
  workspaceObjectCount: number;
  clearWorkspaceConfirmation: string;
  orphanScan: {
    scannedPaths: number;
    referencedPaths: number;
    orphanPaths: string[];
  };
};

export default function MaintenanceClient() {
  const [csrfToken, setCsrfToken] = useState("");
  const [stats, setStats] = useState<MaintenanceStats | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [clearText, setClearText] = useState("");

  async function refresh() {
    const sessionResponse = await fetch("/api/admin/auth/session", { cache: "no-store" });
    const sessionPayload = await sessionResponse.json();
    setCsrfToken(sessionPayload.csrfToken ?? "");

    const response = await fetch("/api/admin/content/maintenance/stats", { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Failed to load maintenance stats.");
      return;
    }
    setStats(payload.stats);
    setError("");
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function runDeleteFailed() {
    if (!window.confirm("Delete all failed workspace batches?")) return;
    const response = await fetch("/api/admin/content/maintenance/delete-failed", {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Delete failed batches failed.");
      return;
    }
    setMessage(`Deleted ${payload.result?.deleted ?? 0} failed batch(es).`);
    await refresh();
  }

  async function scanOrphans() {
    const response = await fetch("/api/admin/content/maintenance/orphans", { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Orphan scan failed.");
      return;
    }
    setMessage(`Found ${payload.result?.orphanPaths?.length ?? 0} orphan workspace objects.`);
    await refresh();
  }

  async function deleteOrphans() {
    const orphanPaths = stats?.orphanScan.orphanPaths ?? [];
    if (orphanPaths.length === 0) return;
    if (!window.confirm(`Delete ${orphanPaths.length} orphan workspace object(s)?`)) return;

    const response = await fetch("/api/admin/content/maintenance/orphans", {
      method: "POST",
      headers: { "content-type": "application/json", "x-csrf-token": csrfToken },
      body: JSON.stringify({ paths: orphanPaths }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Delete orphans failed.");
      return;
    }
    setMessage(`Deleted ${payload.result?.deleted ?? 0} orphan workspace object(s).`);
    await refresh();
  }

  async function clearWorkspace() {
    if (!stats) return;
    if (clearText.trim() !== stats.clearWorkspaceConfirmation) {
      setError(`Type exactly: ${stats.clearWorkspaceConfirmation}`);
      return;
    }
    if (!window.confirm("Final confirmation: clear the full content workspace now?")) return;

    const response = await fetch("/api/admin/content/maintenance/clear-workspace", {
      method: "POST",
      headers: { "content-type": "application/json", "x-csrf-token": csrfToken },
      body: JSON.stringify({ confirmation: clearText }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Clear workspace failed.");
      return;
    }
    setMessage("Workspace cleared.");
    setClearText("");
    await refresh();
  }

  if (!stats) {
    return <main className="min-h-screen bg-[#08101f] px-6 py-10 text-white">Loading workspace maintenance…</main>;
  }

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Admin content maintenance</p>
            <h1 className="mt-3 text-4xl font-black">Workspace cleanup controls</h1>
          </div>
          <Link href="/admin/content" className="rounded-xl border border-white/20 px-5 py-3 font-semibold text-slate-200 hover:border-white/35">Back to portal</Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          <StatCard label="Batches" value={String(stats.totalBatches)} />
          <StatCard label="Failed" value={String(stats.failedBatches)} />
          <StatCard label="Exported" value={String(stats.exportedBatches)} />
          <StatCard label="Files" value={String(stats.totalFiles)} />
          <StatCard label="Workspace objects" value={String(stats.workspaceObjectCount)} />
        </div>

        {error ? <p className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
        {message ? <p className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</p> : null}

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#101a2f] p-6">
          <h2 className="text-2xl font-bold">Maintenance actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={runDeleteFailed} className="rounded-xl border border-amber-500/40 px-4 py-3 text-sm font-semibold text-amber-100 hover:border-amber-400">Delete failed batches</button>
            <button onClick={scanOrphans} className="rounded-xl border border-blue-500/40 px-4 py-3 text-sm font-semibold text-blue-100 hover:border-blue-400">Scan for orphans</button>
            <button onClick={deleteOrphans} disabled={stats.orphanScan.orphanPaths.length === 0} className="rounded-xl border border-red-500/40 px-4 py-3 text-sm font-semibold text-red-100 hover:border-red-400 disabled:opacity-50">Delete orphaned objects</button>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-[#08101f] p-4 text-sm text-slate-300">
            <p>Scanned objects: {stats.orphanScan.scannedPaths}</p>
            <p>Referenced objects: {stats.orphanScan.referencedPaths}</p>
            <p>Orphans: {stats.orphanScan.orphanPaths.length}</p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-red-500/30 bg-red-900/10 p-6">
          <h2 className="text-2xl font-bold text-red-100">High-risk: clear content workspace</h2>
          <p className="mt-3 text-sm text-red-100/90">
            This permanently deletes workspace ingestion artifacts (uploads, extracted files, previews, manifests, generated packages, and batch records).
            It never deletes GitHub repository history, merged PR content, or live production website content.
          </p>
          <label className="mt-4 block text-sm text-red-100">
            Type <span className="font-bold">{stats.clearWorkspaceConfirmation}</span> to enable clear workspace.
            <input
              value={clearText}
              onChange={(event) => setClearText(event.target.value)}
              className="mt-2 w-full rounded-xl border border-red-400/50 bg-[#08101f] px-4 py-3 text-white"
            />
          </label>
          <button
            onClick={clearWorkspace}
            disabled={clearText.trim() !== stats.clearWorkspaceConfirmation}
            className="mt-4 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white disabled:opacity-40"
          >
            Clear workspace
          </button>
        </section>
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
