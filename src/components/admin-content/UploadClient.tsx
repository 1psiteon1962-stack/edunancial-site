"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ALLOWED_EXTENSIONS } from "@/lib/admin-content/config";

const ACCEPTED_UPLOAD_EXTENSIONS = Array.from(ALLOWED_EXTENSIONS).join(",");
const SUPPORTED_UPLOAD_EXTENSIONS = Array.from(ALLOWED_EXTENSIONS);

function isSupportedUpload(file: File) {
  const lowerName = file.name.toLowerCase();
  return SUPPORTED_UPLOAD_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
}

export default function UploadClient() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [batchName, setBatchName] = useState("");
  const [source, setSource] = useState("Claude export");
  const [notes, setNotes] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    void (async () => {
      const sessionResponse = await fetch("/api/admin/auth/session", { cache: "no-store" });
      const payload = await sessionResponse.json();
      setCsrfToken(payload.csrfToken ?? "");
    })();
  }, []);

  function appendFiles(list: FileList | null) {
    if (!list) return;
    const incomingFiles = Array.from(list);
    const acceptedFiles = incomingFiles.filter(isSupportedUpload);
    const rejectedFiles = incomingFiles.filter((file) => !isSupportedUpload(file));
    setError(
      rejectedFiles.length === 0
        ? ""
        : `Skipped unsupported file types: ${rejectedFiles.map((file) => file.name).join(", ")}.`,
    );
    if (acceptedFiles.length > 0) {
      setFiles((current) => [...current, ...acceptedFiles]);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("batchName", batchName || `Content Upload ${new Date().toISOString().slice(0, 10)}`);
    formData.append("source", source);
    formData.append("notes", notes);
    files.forEach((file) => formData.append("files", file));
    controllerRef.current = new AbortController();
    try {
      const response = await fetch("/api/admin/content/upload", {
        method: "POST",
        headers: { "x-csrf-token": csrfToken },
        body: formData,
        signal: controllerRef.current.signal,
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Upload failed.");
        return;
      }
      router.push(`/admin/content/batches/${payload.batch.id}`);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error && error.name === "AbortError" ? "Upload cancelled." : "Upload failed.");
    } finally {
      controllerRef.current = null;
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Batch name
          <input value={batchName} onChange={(event) => setBatchName(event.target.value)} className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white" placeholder="July content drop" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Source
          <input value={source} onChange={(event) => setSource(event.target.value)} className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white" placeholder="Claude export" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-slate-200">
        Notes
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-28 rounded-2xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white" placeholder="Optional context for review." />
      </label>

      <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); appendFiles(event.dataTransfer.files); }} className="rounded-3xl border border-dashed border-blue-400/50 bg-[#101a2f] p-10 text-center text-slate-300">
        <p className="text-lg font-semibold text-white">Drag and drop files or ZIP packages</p>
        <p className="mt-2 text-sm">Allowed: documents, media, images, JSON/CSV, and ZIP bundles up to 50 MB per file.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500">Choose files</button>
          {uploading ? <button type="button" onClick={() => controllerRef.current?.abort()} className="rounded-xl border border-white/15 px-5 py-3 font-semibold">Cancel upload</button> : null}
        </div>
        <input ref={fileInputRef} type="file" accept={ACCEPTED_UPLOAD_EXTENSIONS} multiple onChange={(event) => appendFiles(event.target.files)} className="hidden" />
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#101a2f] p-6">
        <h2 className="text-xl font-bold text-white">Selected files</h2>
        <ul className="mt-4 grid gap-3 text-sm text-slate-300">
          {files.length === 0 ? <li>No files selected.</li> : files.map((file) => <li key={`${file.name}-${file.size}`}>{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB {file.name.toLowerCase().endsWith('.zip') ? '· ZIP archive' : ''}</li>)}
        </ul>
      </div>

      {error ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
      <button disabled={uploading || files.length === 0} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-60">{uploading ? 'Uploading…' : 'Upload batch'}</button>
    </form>
  );
}
