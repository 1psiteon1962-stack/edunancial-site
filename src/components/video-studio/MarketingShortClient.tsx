"use client";

import { useEffect, useState } from "react";

function csrfToken() {
  const match = document.cookie.match(/(?:^|; )edunancial_admin_csrf=([^;]+)/u);
  return match ? decodeURIComponent(match[1]) : "";
}

async function jsonRequest(url: string, init: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", "x-csrf-token": csrfToken(), ...(init.headers ?? {}) },
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) throw new Error(data.error || `Request failed (${response.status}).`);
  return data;
}

export default function MarketingShortClient() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(6);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState("Ready");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    const timer = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/admin/video/jobs/${jobId}`, { cache: "no-store" });
        const data = await response.json();
        if (data?.status) setStatus(data.status);
        if (data?.status === "succeeded" || data?.status === "failed") window.clearInterval(timer);
        if (data?.lastError) setError(data.lastError);
      } catch {
        // A transient poll failure must not cancel a render already running on the worker.
      }
    }, 2500);
    return () => window.clearInterval(timer);
  }, [jobId]);

  async function createShort() {
    if (!file || !title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      setStatus("Creating private project…");
      const created = await jsonRequest("/api/admin/video/projects", {
        method: "POST",
        body: JSON.stringify({ title: title.trim(), fileName: file.name, mimeType: file.type || "application/octet-stream", byteSize: file.size }),
      });
      setProjectId(created.projectId);

      setStatus("Uploading artwork/video…");
      const upload = await fetch(created.signedUploadUrl, { method: "PUT", headers: { "content-type": file.type || "application/octet-stream" }, body: file });
      if (!upload.ok) throw new Error(`Private asset upload failed (${upload.status}).`);

      setStatus("Starting 9:16 render…");
      const queued = await jsonRequest("/api/admin/video/jobs", {
        method: "POST",
        body: JSON.stringify({ projectId: created.projectId, editRecipe: { trimStart: 0, trimEnd: null, durationSeconds: duration } }),
      });
      setJobId(queued.jobId);
      setStatus("queued");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create Marketing Short.");
      setStatus("Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
        <h2 className="text-2xl font-black">Source artwork or video</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">R1 creates one vertical scene from one image or video. Multi-scene ordering, text overlays, narration and transitions come next without changing this render foundation.</p>

        <label className="mt-6 block text-sm font-bold text-slate-200">Project title</label>
        <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} placeholder="Example: Winners Get Training" className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950/50 px-4 py-3 outline-none focus:border-yellow-300" />

        <label className="mt-5 block text-sm font-bold text-slate-200">Artwork or source video</label>
        <input type="file" accept="image/png,image/jpeg,image/webp,video/mp4,video/webm" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-xl border border-dashed border-white/20 bg-slate-950/30 p-4 text-sm" />
        {file ? <p className="mt-2 text-xs text-slate-400">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</p> : null}

        <label className="mt-5 block text-sm font-bold text-slate-200">Still-image duration</label>
        <div className="mt-2 flex items-center gap-3">
          <input type="range" min={2} max={15} value={duration} onChange={(event) => setDuration(Number(event.target.value))} className="w-full" />
          <span className="min-w-16 rounded-lg bg-white/10 px-3 py-2 text-center font-bold">{duration}s</span>
        </div>

        <button type="button" disabled={busy || !file || !title.trim()} onClick={createShort} className="mt-7 w-full rounded-xl bg-yellow-400 px-5 py-4 text-base font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">
          {busy ? "Preparing…" : "Render 9:16 Marketing Short"}
        </button>
      </div>

      <aside className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-300">Render status</p>
        <p className="mt-4 text-2xl font-black capitalize">{status}</p>
        <div className="mt-6 aspect-[9/16] max-h-[520px] rounded-2xl border border-white/10 bg-black/40 p-5 text-center text-sm text-slate-400">
          <div className="flex h-full items-center justify-center">1080 × 1920 vertical output</div>
        </div>
        {projectId ? <p className="mt-4 break-all text-xs text-slate-500">Project: {projectId}</p> : null}
        {jobId ? <p className="mt-1 break-all text-xs text-slate-500">Job: {jobId}</p> : null}
        {error ? <div className="mt-5 rounded-xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-200">{error}</div> : null}
      </aside>
    </section>
  );
}
