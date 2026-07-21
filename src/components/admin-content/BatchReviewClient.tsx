"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { ExtractedFile, UploadBatch } from "@/lib/admin-content/types";
import { COURSE_LEVELS, COURSE_TRACKS, MEMBERSHIP_ACCESS, SUPPORTED_REGIONS, SUPPORTED_UPLOAD_LANGUAGES } from "@/lib/admin-content/upload-intake";

export default function BatchReviewClient({ batchId }: { batchId: string }) {
  const [batch, setBatch] = useState<UploadBatch | null>(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "all", pillar: "all", language: "all" });
  const [selected, setSelected] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ pullRequestUrl?: string } | null>(null);

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

  const approvedCount = batch?.files.filter((f) => f.reviewStatus === "approved").length ?? 0;

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
    setError("");
    try {
      const response = await fetch(`/api/admin/content/batches/${batchId}/publish`, {
        method: "POST",
        headers: { "x-csrf-token": csrfToken },
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Publish failed.");
        return;
      }
      setPublishResult({ pullRequestUrl: payload.github?.pullRequestUrl });
      await refresh();
    } finally {
      setPublishing(false);
    }
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

              <CourseAssignmentPanel file={file} onAssign={(updates) => patchFile(file, updates)} onDirty={setDirty} />

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

        {/* Publish to Course workflow section */}
        <section className="mt-10 rounded-3xl border border-emerald-500/30 bg-emerald-900/10 p-6">
          <h2 className="text-2xl font-bold text-white">Publish to Course</h2>
          <p className="mt-2 text-sm text-slate-300">
            Publishing exports all approved files and creates a GitHub pull request targeting the production course
            structure. <strong className="text-white">Nothing becomes publicly visible until the GitHub PR is reviewed,
            approved, and merged.</strong>
          </p>

          {approvedCount === 0 ? (
            <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
              Approve at least one file before publishing.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#08101f] p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">Pre-publish checklist</p>
                <ul className="mt-3 grid gap-2">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> ZIP uploaded and extracted automatically
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Files validated and classified
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={approvedCount > 0 ? "text-emerald-400" : "text-amber-400"}>
                      {approvedCount > 0 ? "✓" : "○"}
                    </span>{" "}
                    {approvedCount} file{approvedCount !== 1 ? "s" : ""} approved for publication
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">→</span> Academy, Level, Color, Language, Region, Membership assigned per file
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">→</span> After publish: verify course in Academy, Level, Color, and all assets
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#08101f] p-4">
                <p className="text-sm font-semibold text-white">Production destination</p>
                {batch.files.filter((f) => f.reviewStatus === "approved").slice(0, 3).map((f) => (
                  <p key={f.id} className="truncate text-xs text-slate-400" title={f.metadata.intendedDestination}>
                    {f.metadata.intendedDestination || f.normalizedFilename}
                  </p>
                ))}
                {approvedCount > 3 ? <p className="text-xs text-slate-500">…and {approvedCount - 3} more</p> : null}
              </div>
            </div>
          )}

          {publishResult ? (
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              <p className="font-semibold">Published successfully!</p>
              {publishResult.pullRequestUrl ? (
                <p className="mt-1">
                  GitHub PR:{" "}
                  <a href={publishResult.pullRequestUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-100">
                    {publishResult.pullRequestUrl}
                  </a>
                </p>
              ) : null}
              <p className="mt-2 text-xs text-emerald-300">
                After merging the PR, verify on the live production website:
                course appears in the correct Academy and Level, Color category is correct, all files are accessible,
                images/PDFs/videos/audio work, navigation links function, and the course displays correctly.
              </p>
            </div>
          ) : null}

          <button
            disabled={approvedCount === 0 || publishing}
            onClick={publishToCourse}
            className="mt-5 w-full rounded-2xl bg-emerald-600 px-6 py-4 text-lg font-black tracking-wide hover:bg-emerald-500 disabled:opacity-50 sm:w-auto sm:px-10"
          >
            {publishing ? "Publishing…" : `Publish ${approvedCount} approved file${approvedCount !== 1 ? "s" : ""} to course`}
          </button>
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

function CourseAssignmentPanel({
  file,
  onAssign,
  onDirty,
}: {
  file: ExtractedFile;
  onAssign: (updates: Partial<ExtractedFile>) => void;
  onDirty: (dirty: boolean) => void;
}) {
  const [academy, setAcademy] = useState<string>(file.metadata.pillar ?? "uncategorized");
  const [level, setLevel] = useState<string>(file.metadata.academyLevel ?? "");
  const [language, setLanguage] = useState<string>(file.metadata.language ?? "en");
  const [region, setRegion] = useState<string>(file.metadata.region ?? "global");
  const [membership, setMembership] = useState<string>(String(file.metadata.publicationStatus === "published" ? "basic" : "free"));

  useEffect(() => {
    setAcademy(file.metadata.pillar ?? "uncategorized");
    setLevel(file.metadata.academyLevel ?? "");
    setLanguage(file.metadata.language ?? "en");
    setRegion(file.metadata.region ?? "global");
  }, [file]);

  function saveAssignment() {
    onDirty(false);
    onAssign({
      classification: {
        ...file.classification,
        pillar: academy as ExtractedFile["classification"]["pillar"],
        academyLevel: (level || null) as ExtractedFile["classification"]["academyLevel"],
        language: language as ExtractedFile["classification"]["language"],
      },
      metadata: {
        ...file.metadata,
        pillar: academy as ExtractedFile["metadata"]["pillar"],
        academyLevel: (level || null) as ExtractedFile["metadata"]["academyLevel"],
        language: language as ExtractedFile["metadata"]["language"],
        region: region === "global" ? null : region,
      },
    });
  }

  const resolvedPath = buildResolvedPath(academy, level, language, region, file.normalizedFilename);

  return (
    <div className="mt-5 rounded-2xl border border-blue-500/20 bg-blue-900/10 p-4">
      <p className="text-sm font-semibold text-blue-200">Course assignment</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AssignSelect
          label="Academy (Color)"
          value={academy}
          options={["red", "white", "blue", "academy", "uncategorized"]}
          labels={{ red: "Red Academy", white: "White Academy", blue: "Blue Academy", academy: "Academy (General)", uncategorized: "Uncategorized" }}
          onChange={(v) => { setAcademy(v); onDirty(true); }}
        />
        <AssignSelect
          label="Level"
          value={level}
          options={["", ...COURSE_LEVELS]}
          labels={{ "": "— none —", "level-1": "Level 1", "level-2": "Level 2", "level-3": "Level 3", "level-4": "Level 4", "level-5": "Level 5" }}
          onChange={(v) => { setLevel(v); onDirty(true); }}
        />
        <AssignSelect
          label="Language"
          value={language}
          options={[...SUPPORTED_UPLOAD_LANGUAGES]}
          labels={{ en: "English", es: "Español", fr: "Français", "fr-CA": "Français (CA)" }}
          onChange={(v) => { setLanguage(v); onDirty(true); }}
        />
        <AssignSelect
          label="Region"
          value={region}
          options={[...SUPPORTED_REGIONS]}
          labels={{
            "north-america": "North America",
            "latin-america": "Latin America",
            caribbean: "Caribbean",
            europe: "Europe",
            africa: "Africa",
            asia: "Asia",
            "middle-east": "Middle East",
            oceania: "Oceania",
            global: "Global (all regions)",
          }}
          onChange={(v) => { setRegion(v); onDirty(true); }}
        />
        <AssignSelect
          label="Membership level"
          value={membership}
          options={[...MEMBERSHIP_ACCESS]}
          labels={{ free: "Free", basic: "Basic", premium: "Premium", elite: "Elite" }}
          onChange={(v) => { setMembership(v); onDirty(true); }}
        />
      </div>
      <div className="mt-3 rounded-xl border border-white/10 bg-[#08101f] px-4 py-2 text-xs text-slate-400">
        <span className="font-semibold text-slate-200">Resolved destination: </span>
        {resolvedPath}
      </div>
      <button
        type="button"
        onClick={saveAssignment}
        className="mt-3 rounded-xl border border-blue-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200 hover:border-blue-300"
      >
        Apply assignment
      </button>
    </div>
  );
}

function buildResolvedPath(academy: string, level: string, language: string, region: string, filename: string) {
  const regionPart = region && region !== "global" ? `${region}/` : "";
  const levelPart = level ? `${level}/` : "";
  return `content/courses/${academy}/${levelPart}${language}/${regionPart}${filename}`;
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-3xl border border-white/10 bg-[#101a2f] p-5"><p className="text-sm uppercase tracking-[0.2em] text-slate-400">{label}</p><p className="mt-3 text-3xl font-black text-white">{value}</p></div>;
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void; }) {
  return <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-slate-400"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-white/10 bg-[#08101f] px-4 py-3 text-sm text-white">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function AssignSelect({ label, value, options, labels, onChange }: { label: string; value: string; options: string[]; labels: Record<string, string>; onChange: (value: string) => void; }) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-slate-300">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-white/10 bg-[#08101f] px-3 py-2 text-sm text-white"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{labels[opt] ?? opt}</option>
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
