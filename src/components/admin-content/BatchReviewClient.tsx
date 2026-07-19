"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { ExtractedFile, UploadBatch } from "@/lib/admin-content/types";

export default function BatchReviewClient({ batchId }: { batchId: string }) {
  const [batch, setBatch] = useState<UploadBatch | null>(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "all", pillar: "all", language: "all" });
  const [selected, setSelected] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  const refresh = useCallback(async () => {
    const sessionResponse = await fetch("/api/admin/auth/session", { cache: "no-store" });
    const sessionPayload = await sessionResponse.json();
    setCsrfToken(sessionPayload.csrfToken ?? "");
    const response = await fetch(`/api/admin/content/batches/${batchId}`, { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Failed to load batch.");
      return;
    }
    setBatch(payload.batch);
  }, [batchId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const visibleFiles = useMemo(() => {
    if (!batch) return [];
    return batch.files.filter((file) => {
      if (filters.status !== "all" && file.reviewStatus !== filters.status) return false;
      if (filters.pillar !== "all" && file.metadata.pillar !== filters.pillar) return false;
      if (filters.language !== "all" && file.metadata.language !== filters.language) return false;
      return true;
    });
  }, [batch, filters]);

  async function patchFile(file: ExtractedFile, updates: Partial<ExtractedFile>) {
    setDirty(false);
    const response = await fetch(`/api/admin/content/batches/${batchId}/files/${file.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-csrf-token": csrfToken },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error ?? "Update failed.");
      return;
    }
    await refresh();
  }

  async function bulkAction(action: "approve" | "reject") {
    const response = await fetch(`/api/admin/content/batches/${batchId}/${action}`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-csrf-token": csrfToken },
      body: JSON.stringify({ fileIds: selected }),
    });
    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error ?? `${action} failed.`);
      return;
    }
    setSelected([]);
    await refresh();
  }

  async function exportBatch(mode: "export" | "github") {
    const response = await fetch(`/api/admin/content/batches/${batchId}/${mode}`, {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? `${mode} failed.`);
      return;
    }
    if (mode === "export" && payload.downloadUrl) {
      window.open(payload.downloadUrl, "_blank", "noopener,noreferrer");
    }
    await refresh();
  }

  if (!batch) {
    return <main className="min-h-screen bg-[#08101f] px-6 py-10 text-white">Loading batch…</main>;
  }

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Batch review</p>
            <h1 className="mt-3 text-4xl font-black">{batch.name}</h1>
            <p className="mt-3 text-slate-300">Source: {batch.source} · Destination: {batch.destination ?? "courses"} · Status: {batch.status}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/content" className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-slate-200 hover:border-white/30">Back</Link>
            <button onClick={() => exportBatch("export")} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500">Export ZIP</button>
            <button onClick={() => exportBatch("github")} className="rounded-xl border border-blue-400/40 px-5 py-3 font-semibold text-blue-200 hover:border-blue-300">Create GitHub PR</button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          <SummaryCard label="Files" value={String(batch.files.length)} />
          <SummaryCard label="Approved" value={String(batch.files.filter((file) => file.reviewStatus === "approved").length)} />
          <SummaryCard label="Rejected" value={String(batch.files.filter((file) => file.reviewStatus === "rejected").length)} />
          <SummaryCard label="Conflicts" value={String(batch.files.filter((file) => file.conflictStatus !== "none").length)} />
          <SummaryCard label="Warnings" value={String(batch.warnings.length)} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3 rounded-3xl border border-white/10 bg-[#101a2f] p-4">
          <FilterSelect label="Review" value={filters.status} options={["all", "pending", "approved", "rejected"]} onChange={(value) => setFilters((current) => ({ ...current, status: value }))} />
          <FilterSelect label="Pillar" value={filters.pillar} options={["all", "red", "white", "blue", "academy", "uncategorized"]} onChange={(value) => setFilters((current) => ({ ...current, pillar: value }))} />
          <FilterSelect label="Language" value={filters.language} options={["all", "en", "es", "fr", "fr-CA"]} onChange={(value) => setFilters((current) => ({ ...current, language: value }))} />
          <button disabled={selected.length === 0} onClick={() => bulkAction("approve")} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold disabled:opacity-50">Bulk approve</button>
          <button disabled={selected.length === 0} onClick={() => bulkAction("reject")} className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold disabled:opacity-50">Bulk reject</button>
        </div>

        {error ? <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
        {batch.warnings.length > 0 ? <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100"><p className="font-semibold">Batch warnings</p><ul className="mt-2 list-disc pl-6">{batch.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div> : null}

        <div className="mt-8 grid gap-4">
          {visibleFiles.map((file) => (
            <article key={file.id} className="rounded-3xl border border-white/10 bg-[#101a2f] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={selected.includes(file.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, file.id] : current.filter((entry) => entry !== file.id))} className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent" />
                  <div>
                    <h2 className="text-xl font-bold text-white">{file.originalFilename}</h2>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{file.reviewStatus} · {file.duplicateStatus} · {file.metadata.language}</p>
                    {file.archivePath ? <p className="mt-2 text-xs text-slate-400">Archive path: {file.archivePath}</p> : null}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => patchFile(file, { reviewStatus: "approved", approvedAt: new Date().toISOString(), metadata: { ...file.metadata, publicationStatus: "approved" } })} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold">Approve</button>
                  <button onClick={() => patchFile(file, { reviewStatus: "rejected", rejectedAt: new Date().toISOString(), metadata: { ...file.metadata, publicationStatus: "rejected" } })} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold">Reject</button>
                </div>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="text-sm font-semibold text-white">Preview</p>
                  <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-[#08101f] p-4 text-sm text-slate-200">{file.previewText || "No preview available."}</pre>
                  {file.classification.reasons.length > 0 ? <p className="mt-3 text-xs text-slate-400">Reasons: {file.classification.reasons.join("; ")}</p> : null}
                  {file.warnings.length > 0 ? <p className="mt-2 text-xs text-amber-200">Warnings: {file.warnings.join("; ")}</p> : null}
                </div>
                <div className="grid gap-3">
                  <EditableField label="Title" value={file.metadata.title} onSave={(value) => patchFile(file, { metadata: { ...file.metadata, title: value } })} onDirty={setDirty} />
                  <EditableField label="Destination" value={file.metadata.intendedDestination} onSave={(value) => patchFile(file, { metadata: { ...file.metadata, intendedDestination: value }, classification: { ...file.classification, destination: value } })} onDirty={setDirty} />
                  <EditableField label="Description" value={file.metadata.description} multiline onSave={(value) => patchFile(file, { metadata: { ...file.metadata, description: value } })} onDirty={setDirty} />
                  <div className="grid gap-2 rounded-2xl border border-white/10 bg-[#08101f] p-4 text-sm text-slate-300">
                    <p><span className="font-semibold text-white">Classification:</span> {file.classification.category} / {file.classification.subcategory ?? 'general'}</p>
                    <p><span className="font-semibold text-white">Pillar:</span> {file.metadata.pillar}</p>
                    <p><span className="font-semibold text-white">Academy level:</span> {file.metadata.academyLevel ?? 'n/a'}</p>
                    <p><span className="font-semibold text-white">Confidence:</span> {(file.classification.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-white/10 bg-[#101a2f] p-6">
          <h2 className="text-2xl font-bold text-white">Audit history</h2>
          <ul className="mt-4 grid gap-3 text-sm text-slate-300">
            {batch.auditHistory.map((event) => <li key={event.id}>{event.timestamp} · {event.action} · {event.result} · {event.actor}</li>)}
          </ul>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-3xl border border-white/10 bg-[#101a2f] p-5"><p className="text-sm uppercase tracking-[0.2em] text-slate-400">{label}</p><p className="mt-3 text-3xl font-black text-white">{value}</p></div>;
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void; }) {
  return <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-slate-400"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-white/10 bg-[#08101f] px-4 py-3 text-sm text-white">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function EditableField({ label, value, multiline = false, onSave, onDirty }: { label: string; value: string; multiline?: boolean; onSave: (value: string) => void; onDirty: (dirty: boolean) => void; }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-200">
      {label}
      {multiline ? <textarea value={draft} onChange={(event) => { setDraft(event.target.value); onDirty(true); }} className="min-h-24 rounded-2xl border border-white/10 bg-[#08101f] px-4 py-3 text-white" /> : <input value={draft} onChange={(event) => { setDraft(event.target.value); onDirty(true); }} className="rounded-xl border border-white/10 bg-[#08101f] px-4 py-3 text-white" />}
      <button type="button" onClick={() => onSave(draft)} className="justify-self-start rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 hover:border-white/30">Save</button>
    </label>
  );
}
