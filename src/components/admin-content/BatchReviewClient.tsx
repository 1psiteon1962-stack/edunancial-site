"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { ExtractedFile, UploadBatch } from "@/lib/admin-content/types";

const PILLAR_OPTIONS = ["red", "white", "blue", "academy", "uncategorized"] as const;
const ACADEMY_LEVEL_OPTIONS = ["level-1", "level-2", "level-3", "level-4", "level-5"] as const;
const LANGUAGE_OPTIONS = ["en", "es", "fr", "fr-CA"] as const;
const REGION_OPTIONS = [
  "north-america",
  "latin-america",
  "caribbean",
  "europe",
  "africa",
  "asia",
  "middle-east",
  "oceania",
] as const;

function buildCourseDestination(pillar: string, academyLevel: string | null, language: string, filename: string) {
  if (!["red", "white", "blue"].includes(pillar) || !academyLevel) return null;
  const lang = language.replaceAll("-", "_").toLowerCase();
  return `content/courses/${pillar}/${academyLevel}/${lang}/${filename}`;
}

export default function BatchReviewClient({ batchId }: { batchId: string }) {
  const [batch, setBatch] = useState<UploadBatch | null>(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const [publishError, setPublishError] = useState("");
  const [publishResult, setPublishResult] = useState<{ pullRequestUrl: string; branch: string } | null>(null);
  const [publishing, setPublishing] = useState(false);
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

  const approvedCount = useMemo(() => batch?.files.filter((f) => f.reviewStatus === "approved").length ?? 0, [batch]);

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

  async function publishToCourse() {
    setPublishing(true);
    setPublishError("");
    setPublishResult(null);
    const response = await fetch(`/api/admin/content/batches/${batchId}/publish`, {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
    });
    const payload = await response.json();
    setPublishing(false);
    if (!response.ok) {
      setPublishError(payload.error ?? "Publish failed.");
      return;
    }
    setPublishResult(payload.github);
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
            <p className="mt-3 text-slate-300">Source: {batch.source} · Status: {batch.status}</p>
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
            <FileReviewCard
              key={file.id}
              file={file}
              selected={selected.includes(file.id)}
              onSelect={(checked) => setSelected((current) => checked ? [...current, file.id] : current.filter((entry) => entry !== file.id))}
              onPatch={(updates) => patchFile(file, updates)}
              onDirty={setDirty}
            />
          ))}
        </div>

        {/* Publish to Course section */}
        <section className="mt-10 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6">
          <h2 className="text-2xl font-bold text-white">Publish to Course</h2>
          <p className="mt-2 text-sm text-slate-300">
            When you are ready, publish all approved files to the live course by creating a GitHub pull request.
            The content will be placed in the correct course directory and become publicly visible after the PR is merged and the site is deployed.
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {approvedCount} file{approvedCount !== 1 ? "s" : ""} approved and ready to publish.
          </p>
          {publishResult ? (
            <div className="mt-4 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4">
              <p className="font-semibold text-emerald-200">✓ Pull request created</p>
              <p className="mt-1 text-sm text-slate-300">Branch: <code className="text-emerald-300">{publishResult.branch}</code></p>
              <a href={publishResult.pullRequestUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
                Open Pull Request ↗
              </a>
              <p className="mt-3 text-xs text-slate-400">Review and merge the PR on GitHub to make course content live. The Netlify deploy preview will show the changes before merging.</p>
            </div>
          ) : (
            <button
              onClick={publishToCourse}
              disabled={publishing || approvedCount === 0}
              className="mt-4 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {publishing ? "Publishing…" : "Publish Approved Files to Course →"}
            </button>
          )}
          {publishError ? <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{publishError}</p> : null}
          {batch.exports[0]?.github ? (
            <div className="mt-4 text-sm text-slate-400">
              Latest PR:{" "}
              <a href={batch.exports[0].github.pullRequestUrl} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline hover:text-blue-200">
                {batch.exports[0].github.pullRequestUrl}
              </a>
              {" (branch: "}<code>{batch.exports[0].github.branch}</code>{")"}
            </div>
          ) : null}
        </section>

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

interface FileReviewCardProps {
  file: ExtractedFile;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onPatch: (updates: Partial<ExtractedFile>) => void;
  onDirty: (dirty: boolean) => void;
}

function FileReviewCard({ file, selected, onSelect, onPatch, onDirty }: FileReviewCardProps) {
  const normalizedFilename = file.normalizedFilename || file.originalFilename;

  function buildUpdatedDestination(
    pillar: string,
    academyLevel: string | null,
    language: string,
  ) {
    const resolved = buildCourseDestination(pillar, academyLevel, language, normalizedFilename);
    return resolved ?? file.classification.destination;
  }

  function handlePillarChange(pillar: string) {
    const newDest = buildUpdatedDestination(pillar, file.metadata.academyLevel, file.metadata.language);
    onPatch({
      classification: { ...file.classification, pillar: pillar as ExtractedFile["classification"]["pillar"], destination: newDest },
      metadata: { ...file.metadata, pillar: pillar as ExtractedFile["metadata"]["pillar"], intendedDestination: newDest },
    });
  }

  function handleAcademyLevelChange(level: string) {
    const nextLevel = level as ExtractedFile["classification"]["academyLevel"];
    const newDest = buildUpdatedDestination(file.metadata.pillar, nextLevel, file.metadata.language);
    onPatch({
      classification: { ...file.classification, academyLevel: nextLevel, destination: newDest },
      metadata: { ...file.metadata, academyLevel: nextLevel, intendedDestination: newDest },
    });
  }

  function handleLanguageChange(language: string) {
    const newDest = buildUpdatedDestination(file.metadata.pillar, file.metadata.academyLevel, language);
    onPatch({
      classification: { ...file.classification, language: language as ExtractedFile["classification"]["language"], destination: newDest },
      metadata: { ...file.metadata, language: language as ExtractedFile["metadata"]["language"], intendedDestination: newDest },
    });
  }

  function handleRegionChange(region: string) {
    onPatch({
      metadata: { ...file.metadata, region: region || null },
    });
  }

  const resolvedDestination = file.classification.destination || file.metadata.intendedDestination;

  return (
    <article className="rounded-3xl border border-white/10 bg-[#101a2f] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <input type="checkbox" checked={selected} onChange={(event) => onSelect(event.target.checked)} className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent" />
          <div>
            <h2 className="text-xl font-bold text-white">{file.originalFilename}</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{file.reviewStatus} · {file.duplicateStatus} · {file.metadata.language}</p>
            {file.archivePath ? <p className="mt-2 text-xs text-slate-400">Archive path: {file.archivePath}</p> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => onPatch({ reviewStatus: "approved", approvedAt: new Date().toISOString(), metadata: { ...file.metadata, publicationStatus: "approved" } })} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold">Approve</button>
          <button onClick={() => onPatch({ reviewStatus: "rejected", rejectedAt: new Date().toISOString(), metadata: { ...file.metadata, publicationStatus: "rejected" } })} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold">Reject</button>
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
          <EditableField label="Title" value={file.metadata.title} onSave={(value) => onPatch({ metadata: { ...file.metadata, title: value } })} onDirty={onDirty} />

          {/* Course Assignment dropdowns */}
          <div className="rounded-2xl border border-blue-400/20 bg-[#08101f] p-4">
            <p className="mb-3 text-sm font-semibold text-blue-200">Course Assignment</p>
            <div className="grid gap-3">
              <SelectableField
                label="Color Track (Pillar)"
                value={file.metadata.pillar}
                options={[...PILLAR_OPTIONS]}
                onChange={handlePillarChange}
              />
              <SelectableField
                label="Academy Level"
                value={file.metadata.academyLevel ?? ""}
                options={["", ...ACADEMY_LEVEL_OPTIONS]}
                optionLabels={{ "": "— None —" }}
                onChange={handleAcademyLevelChange}
              />
              <SelectableField
                label="Language"
                value={file.metadata.language}
                options={[...LANGUAGE_OPTIONS] as string[]}
                onChange={handleLanguageChange}
              />
              <SelectableField
                label="Region"
                value={file.metadata.region ?? ""}
                options={["", ...REGION_OPTIONS]}
                optionLabels={{ "": "— Global —" }}
                onChange={handleRegionChange}
              />
            </div>
            {resolvedDestination ? (
              <div className="mt-3 rounded-xl border border-white/10 bg-[#101a2f] px-3 py-2">
                <p className="text-xs text-slate-400">Destination path</p>
                <p className="mt-1 break-all font-mono text-xs text-emerald-300">{resolvedDestination}</p>
              </div>
            ) : null}
          </div>

          <EditableField label="Destination (override)" value={file.metadata.intendedDestination} onSave={(value) => onPatch({ metadata: { ...file.metadata, intendedDestination: value }, classification: { ...file.classification, destination: value } })} onDirty={onDirty} />
          <EditableField label="Description" value={file.metadata.description} multiline onSave={(value) => onPatch({ metadata: { ...file.metadata, description: value } })} onDirty={onDirty} />
          <div className="grid gap-2 rounded-2xl border border-white/10 bg-[#08101f] p-4 text-sm text-slate-300">
            <p><span className="font-semibold text-white">Classification:</span> {file.classification.category} / {file.classification.subcategory ?? 'general'}</p>
            <p><span className="font-semibold text-white">Confidence:</span> {(file.classification.confidence * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-3xl border border-white/10 bg-[#101a2f] p-5"><p className="text-sm uppercase tracking-[0.2em] text-slate-400">{label}</p><p className="mt-3 text-3xl font-black text-white">{value}</p></div>;
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void; }) {
  return <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-slate-400"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-white/10 bg-[#08101f] px-4 py-3 text-sm text-white">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function SelectableField({ label, value, options, optionLabels, onChange }: { label: string; value: string; options: string[]; optionLabels?: Record<string, string>; onChange: (value: string) => void; }) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-slate-300">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-white/10 bg-[#101a2f] px-3 py-2 text-sm text-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels?.[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
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

