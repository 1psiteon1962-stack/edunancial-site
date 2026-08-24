"use client";

import { useEffect, useRef, useState } from "react";

type SceneDraft = { file: File; assetId?: string; durationSeconds: number; overlayText: string; fitMode: "contain" | "cover" };

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

async function uploadSigned(url: string, file: Blob, mimeType: string) {
  const response = await fetch(url, { method: "PUT", headers: { "content-type": mimeType }, body: file });
  if (!response.ok) throw new Error(`Private asset upload failed (${response.status}).`);
}

export default function MarketingShortClient() {
  const [title, setTitle] = useState("");
  const [scenes, setScenes] = useState<SceneDraft[]>([]);
  const [narration, setNarration] = useState<Blob | null>(null);
  const [narrationName, setNarrationName] = useState("narration.webm");
  const [recording, setRecording] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState("Ready");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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
        // Poll failures do not cancel the worker render.
      }
    }, 2500);
    return () => window.clearInterval(timer);
  }, [jobId]);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).slice(0, Math.max(0, 30 - scenes.length)).map((file) => ({
      file,
      durationSeconds: 6,
      overlayText: "",
      fitMode: "contain" as const,
    }));
    setScenes((current) => [...current, ...next]);
  }

  function moveScene(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= scenes.length) return;
    const copy = [...scenes];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setScenes(copy);
  }

  async function startRecording() {
    setError(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
      setNarration(blob);
      setNarrationName(`narration-${Date.now()}.webm`);
      stream.getTracks().forEach((track) => track.stop());
    };
    recorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  async function createShort() {
    if (!title.trim() || scenes.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      setStatus("Creating project…");
      const first = scenes[0].file;
      const created = await jsonRequest("/api/admin/video/projects", {
        method: "POST",
        body: JSON.stringify({ title: title.trim(), fileName: first.name, mimeType: first.type || "application/octet-stream", byteSize: first.size }),
      });
      setProjectId(created.projectId);
      await uploadSigned(created.signedUploadUrl, first, first.type || "application/octet-stream");

      const uploadedScenes = [...scenes];
      uploadedScenes[0] = { ...uploadedScenes[0], assetId: created.assetId };
      for (let i = 1; i < uploadedScenes.length; i += 1) {
        setStatus(`Uploading scene ${i + 1} of ${uploadedScenes.length}…`);
        const file = uploadedScenes[i].file;
        const asset = await jsonRequest(`/api/admin/video/projects/${created.projectId}/assets`, {
          method: "POST",
          body: JSON.stringify({ fileName: file.name, mimeType: file.type || "application/octet-stream", byteSize: file.size }),
        });
        await uploadSigned(asset.signedUploadUrl, file, file.type || "application/octet-stream");
        uploadedScenes[i] = { ...uploadedScenes[i], assetId: asset.assetId };
      }
      setScenes(uploadedScenes);

      let narrationAssetId: string | null = null;
      if (narration) {
        setStatus("Uploading narration…");
        const mimeType = narration.type || "audio/webm";
        const audioAsset = await jsonRequest(`/api/admin/video/projects/${created.projectId}/assets`, {
          method: "POST",
          body: JSON.stringify({ fileName: narrationName, mimeType, byteSize: narration.size }),
        });
        await uploadSigned(audioAsset.signedUploadUrl, narration, mimeType);
        narrationAssetId = audioAsset.assetId;
      }

      setStatus("Saving composition…");
      await jsonRequest(`/api/admin/video/projects/${created.projectId}/composition`, {
        method: "PUT",
        body: JSON.stringify({
          scenes: uploadedScenes.map((scene) => ({ assetId: scene.assetId, durationSeconds: scene.durationSeconds, overlayText: scene.overlayText, fitMode: scene.fitMode })),
          narration: narrationAssetId ? { assetId: narrationAssetId, locale: "en-US", volume: 1 } : null,
        }),
      });

      setStatus("Starting 9:16 render…");
      const queued = await jsonRequest("/api/admin/video/jobs", {
        method: "POST",
        body: JSON.stringify({ projectId: created.projectId, editRecipe: { trimStart: 0, trimEnd: null, durationSeconds: uploadedScenes[0].durationSeconds } }),
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
    <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
        <h2 className="text-2xl font-black">Marketing Short editor</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">Add up to 30 artwork/video scenes, set their order and timing, and optionally record narration directly from your microphone.</p>

        <label className="mt-6 block text-sm font-bold text-slate-200">Project title</label>
        <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} placeholder="Example: Your Money Should Work While You Sleep" className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950/50 px-4 py-3 outline-none focus:border-yellow-300" />

        <label className="mt-5 block text-sm font-bold text-slate-200">Artwork / video scenes</label>
        <input type="file" multiple accept="image/png,image/jpeg,image/webp,video/mp4,video/webm" onChange={(event) => addFiles(event.target.files)} className="mt-2 block w-full rounded-xl border border-dashed border-white/20 bg-slate-950/30 p-4 text-sm" />

        <div className="mt-4 space-y-3">
          {scenes.map((scene, index) => (
            <div key={`${scene.file.name}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold">Scene {index + 1}: {scene.file.name}</p>
                  <p className="text-xs text-slate-500">{(scene.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => moveScene(index, -1)} className="rounded-lg border border-white/15 px-3 py-2 text-xs">Up</button>
                  <button type="button" onClick={() => moveScene(index, 1)} className="rounded-lg border border-white/15 px-3 py-2 text-xs">Down</button>
                  <button type="button" onClick={() => setScenes((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg border border-red-400/30 px-3 py-2 text-xs text-red-200">Remove</button>
                </div>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <label className="text-xs text-slate-400">Duration (sec)<input type="number" min={1} max={60} value={scene.durationSeconds} onChange={(event) => setScenes((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, durationSeconds: Number(event.target.value) } : item))} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white" /></label>
                <label className="text-xs text-slate-400">Fit<select value={scene.fitMode} onChange={(event) => setScenes((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, fitMode: event.target.value as "contain" | "cover" } : item))} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white"><option value="contain">Contain (preserve artwork)</option><option value="cover">Cover (crop to fill)</option></select></label>
                <label className="text-xs text-slate-400">Optional overlay<input value={scene.overlayText} onChange={(event) => setScenes((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, overlayText: event.target.value } : item))} maxLength={500} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white" /></label>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-950/20 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="font-bold">Narration</p><p className="text-xs text-slate-400">Record your voice here, or upload an existing audio file.</p></div>
            <div className="flex gap-2">
              {!recording ? <button type="button" onClick={startRecording} className="rounded-lg bg-blue-400 px-4 py-2 text-sm font-black text-slate-950">Start recording</button> : <button type="button" onClick={stopRecording} className="rounded-lg bg-red-400 px-4 py-2 text-sm font-black text-slate-950">Stop recording</button>}
            </div>
          </div>
          <input type="file" accept="audio/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setNarration(file); setNarrationName(file.name); } }} className="mt-3 block w-full text-sm" />
          {narration ? <p className="mt-2 text-xs text-green-300">Narration ready: {narrationName} · {(narration.size / 1024 / 1024).toFixed(2)} MB</p> : null}
        </div>

        <button type="button" disabled={busy || scenes.length === 0 || !title.trim()} onClick={createShort} className="mt-7 w-full rounded-xl bg-yellow-400 px-5 py-4 text-base font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">
          {busy ? "Preparing…" : `Render ${scenes.length || ""} Scene Marketing Short`}
        </button>
      </div>

      <aside className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-300">Render status</p>
        <p className="mt-4 text-2xl font-black capitalize">{status}</p>
        <div className="mt-6 aspect-[9/16] max-h-[520px] rounded-2xl border border-white/10 bg-black/40 p-5 text-center text-sm text-slate-400"><div className="flex h-full items-center justify-center">1080 × 1920 vertical output</div></div>
        {projectId ? <p className="mt-4 break-all text-xs text-slate-500">Project: {projectId}</p> : null}
        {jobId ? <p className="mt-1 break-all text-xs text-slate-500">Job: {jobId}</p> : null}
        {error ? <div className="mt-5 rounded-xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-200">{error}</div> : null}
      </aside>
    </section>
  );
}
