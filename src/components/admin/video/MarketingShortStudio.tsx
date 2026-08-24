"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Job = { id: string; status: string; last_error?: string | null };

export default function MarketingShortStudio() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(6);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!jobId || job?.status === "succeeded" || job?.status === "failed") return;
    const timer = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/admin/video/jobs/${jobId}`, { cache: "no-store" });
        const payload = await response.json();
        if (response.ok && payload.job) setJob(payload.job);
      } catch { /* keep polling */ }
    }, 2500);
    return () => window.clearInterval(timer);
  }, [jobId, job?.status]);

  async function createShort() {
    if (!file || !title.trim()) return;
    setBusy(true); setMessage(""); setJob(null); setJobId(null);
    try {
      const projectResponse = await fetch("/api/admin/video/projects", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: title.trim(), fileName: file.name, mimeType: file.type, byteSize: file.size }),
      });
      const project = await projectResponse.json();
      if (!projectResponse.ok || !project.success) throw new Error(project.error || "Could not create video project.");

      const uploadResponse = await fetch(project.signedUploadUrl, { method: "PUT", headers: { "content-type": file.type }, body: file });
      if (!uploadResponse.ok) throw new Error(`Artwork upload failed (${uploadResponse.status}).`);

      const jobResponse = await fetch("/api/admin/video/jobs", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ projectId: project.projectId, editRecipe: { trimStart: 0, trimEnd: null, durationSeconds: duration } }),
      });
      const queued = await jobResponse.json();
      if (!jobResponse.ok || !queued.success) throw new Error(queued.error || "Could not start render.");
      setJobId(queued.jobId); setJob({ id: queued.jobId, status: "queued" });
      setMessage("Render accepted. You can leave this page after it reaches Succeeded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Marketing Short creation failed.");
    } finally { setBusy(false); }
  }

  const acceptable = "image/png,image/jpeg,image/webp,video/mp4,video/webm";

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-sm font-black uppercase tracking-[0.35em] text-yellow-400">Video Studio · Marketing</p><h1 className="mt-3 text-4xl font-black">Create Marketing Short</h1><p className="mt-3 max-w-2xl text-slate-400">Turn approved artwork or a source video into a 9:16 vertical MP4 for TikTok and YouTube Shorts. This first release renders one source asset per Short; multi-scene sequencing comes next.</p></div>
          <Link href="/admin/dashboard" className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-bold">← Command Center</Link>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <label className="block text-sm font-bold">Project title<input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} placeholder="1 out of 5 businesses fail" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none focus:border-yellow-400" /></label>
            <label className="mt-6 block text-sm font-bold">Artwork or source video<input type="file" accept={acceptable} onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-xl border border-dashed border-white/20 bg-slate-950/30 p-5 text-sm" /></label>
            {file && <p className="mt-2 text-xs text-slate-400">Selected: {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</p>}
            <label className="mt-6 block text-sm font-bold">Still-art duration: {duration} seconds<input type="range" min={3} max={15} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="mt-3 w-full" /></label>
            <button disabled={busy || !file || !title.trim()} onClick={createShort} className="mt-7 min-h-14 w-full rounded-xl bg-yellow-400 px-5 py-3 font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">{busy ? "Uploading…" : "Render 9:16 Marketing Short"}</button>
            {message && <p className="mt-4 rounded-xl bg-slate-950/30 p-4 text-sm text-slate-300">{message}</p>}
          </div>

          <aside className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">Render status</p><p className="mt-3 text-2xl font-black capitalize">{job?.status ?? "Not started"}</p>
            {job?.last_error && <p className="mt-4 text-sm text-red-300">{job.last_error}</p>}
            <div className="mt-6 space-y-2 text-sm text-slate-400"><p>Output: 1080 × 1920</p><p>Format: MP4 / H.264</p><p>Orientation: 9:16 vertical</p><p>Use: TikTok / YouTube Shorts</p></div>
          </aside>
        </section>
      </div>
    </main>
  );
}
