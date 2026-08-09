"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ConfirmDialog from "@/components/admin-content/ConfirmDialog";
import { getVisibleSelectionState, pruneSelection, replaceVisibleSelection, summarizeSelectedBatches, toggleSelectionItem } from "@/lib/admin-content/selection";
import type { BatchSummary } from "@/lib/admin-content/types";

type DeleteDialogState =
  | { type: "single"; batchIds: string[] }
  | { type: "bulk"; batchIds: string[] }
  | { type: "failed"; batchIds: string[] }
  | null;

export default function ContentDashboardClient() {
  const [batches, setBatches] = useState<BatchSummary[]>([]);
  const [csrfToken, setCsrfToken] = useState("");
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>(null);
  const desktopMasterCheckboxRef = useRef<HTMLInputElement | null>(null);
  const mobileMasterCheckboxRef = useRef<HTMLInputElement | null>(null);

  const visibleBatchIds = useMemo(() => batches.map((batch) => batch.id), [batches]);
  const visibleSelection = useMemo(
    () => getVisibleSelectionState(selectedBatchIds, visibleBatchIds),
    [selectedBatchIds, visibleBatchIds],
  );
  const selectedBatches = useMemo(
    () => batches.filter((batch) => selectedBatchIds.includes(batch.id)),
    [batches, selectedBatchIds],
  );
  const deleteDialogBatches = useMemo(
    () => batches.filter((batch) => deleteDialog?.batchIds.includes(batch.id)),
    [batches, deleteDialog],
  );

  async function refreshBatches() {
    const batchesResponse = await fetch("/api/admin/content/batches", { cache: "no-store" });
    const batchesPayload = await batchesResponse.json();
    const nextBatches = batchesPayload.batches ?? [];
    setBatches(nextBatches);
    setSelectedBatchIds((current) => pruneSelection(current, nextBatches.map((batch: BatchSummary) => batch.id)));
  }

  useEffect(() => {
    void (async () => {
      const sessionResponse = await fetch("/api/admin/auth/session", { cache: "no-store" });
      const sessionPayload = await sessionResponse.json();
      setCsrfToken(sessionPayload.csrfToken ?? "");
      await refreshBatches();
    })();
  }, []);

  useEffect(() => {
    for (const ref of [desktopMasterCheckboxRef, mobileMasterCheckboxRef]) {
      if (ref.current) {
        ref.current.indeterminate = visibleSelection.someVisibleSelected;
      }
    }
  }, [visibleSelection]);

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST", headers: { "x-csrf-token": csrfToken } });
    window.location.href = "/admin/login";
  }

  const deleteBatches = useCallback(async (batchIds: string[], allowExported: boolean) => {
    const response = await fetch("/api/admin/content/batches/bulk-delete", {
      method: "POST",
      headers: { "content-type": "application/json", "x-csrf-token": csrfToken },
      body: JSON.stringify({ batchIds, allowExported }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Batch delete failed.");
      return;
    }
    setError("");
    setMessage(
      payload.result?.partial
        ? `Deleted ${payload.result?.deleted ?? 0} batch(es) with ${payload.result?.failedObjects?.length ?? 0} cleanup warning(s).`
        : `Deleted ${payload.result?.deleted ?? 0} batch(es).`,
    );
    setSelectedBatchIds((current) => current.filter((id) => !batchIds.includes(id)));
    setDeleteDialog(null);
    await refreshBatches();
  }, [csrfToken]);

  const deleteFailedBatches = useCallback(async () => {
    const response = await fetch("/api/admin/content/maintenance/delete-failed", {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Failed-batch cleanup failed.");
      return;
    }
    setError("");
    setMessage(
      payload.result?.partial
        ? `Deleted ${payload.result?.deleted ?? 0} failed batch(es) with ${payload.result?.failedObjects?.length ?? 0} cleanup warning(s).`
        : `Deleted ${payload.result?.deleted ?? 0} failed batch(es).`,
    );
    setSelectedBatchIds([]);
    setDeleteDialog(null);
    await refreshBatches();
  }, [csrfToken]);

  const deleteDialogSummary = useMemo(() => {
    if (!deleteDialog || deleteDialogBatches.length === 0) return null;
    const summary = summarizeSelectedBatches(deleteDialogBatches);
    if (deleteDialog.type === "single") {
      const batch = deleteDialogBatches[0];
      return {
        title: "Delete Batch",
        description: [
          `Batch: ${batch.name}`,
          `Status: ${batch.status}`,
          `Files: ${batch.totalFiles}`,
          batch.status === "exported"
            ? "Exported workspace safety: only Admin Content Workspace copies are removed. GitHub commits, pull requests, published curriculum, and production content are not removed."
            : null,
        ]
          .filter(Boolean)
          .join("\n"),
        confirmLabel: "Delete Batch",
        onConfirm: () => deleteBatches([batch.id], batch.status === "exported"),
      };
    }
    if (deleteDialog.type === "failed") {
      return {
        title: "Delete Failed Batches",
        description: [
          `Failed batches selected: ${summary.batchCount}`,
          `Files in failed batches: ${summary.totalFiles}`,
          "Only failed Admin Content Workspace batches are removed. GitHub and published production content are not removed.",
        ].join("\n"),
        confirmLabel: "Delete Failed Batches",
        onConfirm: deleteFailedBatches,
      };
    }
    return {
      title: "Delete Selected Batches",
      description: [
        `Selected batches: ${summary.batchCount}`,
        `Total files: ${summary.totalFiles}`,
        `Exported batches: ${summary.exportedBatches}`,
        `Failed batches: ${summary.failedBatches}`,
        `Conflicts: ${summary.conflicts}`,
        summary.exportedBatches > 0
          ? "Exported workspace safety: only workspace copies are removed. GitHub commits, branches, merged PR content, published curriculum, and production content are not removed."
          : null,
      ]
        .filter(Boolean)
        .join("\n"),
      confirmLabel: "Delete Selected Batches",
      onConfirm: () => deleteBatches(deleteDialog.batchIds, summary.exportedBatches > 0),
    };
  }, [deleteBatches, deleteDialog, deleteDialogBatches, deleteFailedBatches]);

  return (
    <main className="min-h-screen bg-[#08101f] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Admin content workspace</p>
            <h1 className="mt-3 text-4xl font-black">Upload & Review Portal</h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Securely upload content batches, inspect extracted files, review destinations, and prepare a GitHub-ready package without publishing automatically.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/content/upload" className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500">
              Upload Content
            </Link>
            <Link href="/admin/content/maintenance" className="rounded-xl border border-amber-400/40 px-5 py-3 font-semibold text-amber-200 hover:border-amber-300">
              Maintenance
            </Link>
            <button onClick={logout} className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-slate-200 hover:border-white/30">
              Logout
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <StatCard label="Batches" value={String(batches.length)} />
          <StatCard label="Pending files" value={String(batches.reduce((sum, batch) => sum + batch.pendingFiles, 0))} />
          <StatCard label="Approved files" value={String(batches.reduce((sum, batch) => sum + batch.approvedFiles, 0))} />
          <StatCard label="Conflicts" value={String(batches.reduce((sum, batch) => sum + batch.conflicts, 0))} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {selectedBatchIds.length > 0 ? (
            <>
              <button
                type="button"
                onClick={() => setDeleteDialog({ type: "bulk", batchIds: selectedBatchIds })}
                className="rounded-xl border border-red-500/40 px-4 py-3 text-sm font-semibold text-red-200 hover:border-red-400"
              >
                Delete Selected Batches
              </button>
              <button
                type="button"
                onClick={() => setSelectedBatchIds([])}
                className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-white/30"
              >
                Clear Selection
              </button>
            </>
          ) : null}
          <button
            type="button"
            onClick={() => setDeleteDialog({ type: "failed", batchIds: batches.filter((batch) => batch.status === "failed").map((batch) => batch.id) })}
            disabled={!batches.some((batch) => batch.status === "failed")}
            className="rounded-xl border border-amber-500/40 px-4 py-3 text-sm font-semibold text-amber-200 hover:border-amber-400 disabled:opacity-40"
          >
            Delete Failed Batches
          </button>
        </div>

        {error ? <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
        {message ? <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</p> : null}

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#101a2f]">
          <div className="hidden grid-cols-[0.5fr_1.6fr_0.9fr_0.9fr_1fr_1.2fr] gap-4 border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.25em] text-slate-400 md:grid">
            <label className="flex items-center gap-3 text-xs text-slate-300">
              <input
              ref={desktopMasterCheckboxRef}
                type="checkbox"
                aria-label="Select All Visible"
                checked={visibleSelection.allVisibleSelected}
                onChange={(event) => setSelectedBatchIds((current) => replaceVisibleSelection(current, visibleBatchIds, event.target.checked))}
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              <span>SELECT</span>
            </label>
            <span>BATCH</span>
            <span>STATUS</span>
            <span>FILES</span>
            <span>SOURCE</span>
            <span>ACTIONS</span>
          </div>
          <div className="border-b border-white/10 px-5 py-4 md:hidden">
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-200">
              <input
              ref={mobileMasterCheckboxRef}
                type="checkbox"
                aria-label="Select All Visible"
                checked={visibleSelection.allVisibleSelected}
                onChange={(event) => setSelectedBatchIds((current) => replaceVisibleSelection(current, visibleBatchIds, event.target.checked))}
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              Select All Visible
            </label>
          </div>
          {batches.length === 0 ? (
            <div className="px-5 py-10 text-slate-300">
              <p>No content batches are currently stored.</p>
              <Link href="/admin/content/upload" className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500">
                Upload Content
              </Link>
            </div>
          ) : (
            batches.map((batch) => (
              <div key={batch.id} className="grid gap-4 border-b border-white/5 px-5 py-4 text-sm text-slate-200 last:border-b-0 md:grid-cols-[0.5fr_1.6fr_0.9fr_0.9fr_1fr_1.2fr]">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    aria-label={`Select batch ${batch.name}`}
                    checked={selectedBatchIds.includes(batch.id)}
                    onChange={(event) => setSelectedBatchIds((current) => toggleSelectionItem(current, batch.id, event.target.checked))}
                    className="h-4 w-4 rounded border-white/20 bg-transparent"
                  />
                </div>
                <div>
                  <p className="font-semibold text-white">{batch.name}</p>
                  <p className="mt-1 text-xs text-slate-400">{batch.createdAt}</p>
                </div>
                <span className="text-sm md:pt-1">
                  <span className="mr-2 text-xs uppercase tracking-[0.2em] text-slate-500 md:hidden">Status</span>
                  {batch.status}
                </span>
                <span className="text-sm md:pt-1">
                  <span className="mr-2 text-xs uppercase tracking-[0.2em] text-slate-500 md:hidden">Files</span>
                  {batch.totalFiles}
                </span>
                <span className="text-sm md:pt-1">
                  <span className="mr-2 text-xs uppercase tracking-[0.2em] text-slate-500 md:hidden">Source</span>
                  {batch.source}
                </span>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/admin/content/batches/${batch.id}`} className="font-semibold text-blue-300 hover:text-blue-200">
                    Open batch
                  </Link>
                  <button
                    type="button"
                    aria-label={`Delete batch ${batch.name}`}
                    onClick={() => setDeleteDialog({ type: "single", batchIds: [batch.id] })}
                    className="font-semibold text-red-200 hover:text-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {deleteDialogSummary ? (
        <ConfirmDialog
          open
          title={deleteDialogSummary.title}
          description={deleteDialogSummary.description}
          confirmLabel={deleteDialogSummary.confirmLabel}
          onConfirm={deleteDialogSummary.onConfirm}
          onCancel={() => setDeleteDialog(null)}
        />
      ) : null}
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
