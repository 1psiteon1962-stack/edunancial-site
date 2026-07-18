"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  CU_CATEGORY_OPTIONS,
  CU_LANGUAGE_OPTIONS,
  CU_LEVEL_OPTIONS,
  CU_LOCAL_STORAGE_KEY,
  CU_TRACK_OPTIONS,
  CU_UPLOAD_ACCEPT,
} from "@/lib/cu/constants";
import type { CuFileRecord, CuPublishInput } from "@/lib/cu/types";

type PublishResponse = {
  mode: "github" | "filesystem";
  commitSha: string | null;
  results: Array<{ id: string; destination: string; published: boolean; error?: string }>;
};

function toBase64Utf8(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function dataUrl(file: CuFileRecord) {
  return `data:${file.mimeType};base64,${file.contentBase64}`;
}

export default function CUWorkbench({ authenticated }: { authenticated: boolean }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const [hasAccess, setHasAccess] = useState(authenticated);
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState<CuFileRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [publishMeta, setPublishMeta] = useState<{ mode: string; commitSha: string | null } | null>(null);

  useEffect(() => {
    if (!hasAccess) {
      return;
    }

    try {
      const raw = window.localStorage.getItem(CU_LOCAL_STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as CuFileRecord[];
      if (Array.isArray(parsed)) {
        setFiles(parsed);
        setSelectedId(parsed[0]?.id ?? null);
      }
    } catch {
      window.localStorage.removeItem(CU_LOCAL_STORAGE_KEY);
    }
  }, [hasAccess]);

  const selectedFile = useMemo(() => files.find((file) => file.id === selectedId) ?? null, [files, selectedId]);
  const metrics = useMemo(() => {
    const uploaded = files.length;
    const published = files.filter((file) => file.status === "published").length;
    const errors = files.filter((file) => file.status === "error").length;
    const pending = uploaded - published - errors;
    return {
      uploaded,
      pending,
      published,
      errors,
      progress: uploaded === 0 ? 0 : Math.round((published / uploaded) * 100),
    };
  }, [files]);

  function persist(nextFiles: CuFileRecord[]) {
    setFiles(nextFiles);
    window.localStorage.setItem(CU_LOCAL_STORAGE_KEY, JSON.stringify(nextFiles));
  }

  async function authenticate() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/cu/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error || "Password rejected.");
      }

      setHasAccess(true);
      setPassword("");
      setMessage("CU access granted.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Password rejected.");
    } finally {
      setBusy(false);
    }
  }

  async function sendUploads(fileList: File[]) {
    if (fileList.length === 0) {
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      fileList.forEach((file) => formData.append("files", file));
      const response = await fetch("/api/cu/uploads", { method: "POST", body: formData });
      const payload = (await response.json()) as { files?: CuFileRecord[]; error?: string };
      if (!response.ok || !payload.files) {
        throw new Error(payload.error || "Upload failed.");
      }

      const uploadedFiles = payload.files;
      const nextFiles = [...uploadedFiles, ...files];
      persist(nextFiles);
      setSelectedId((current) => uploadedFiles[0]?.id ?? current);
      setMessage(`Loaded ${uploadedFiles.length} file${uploadedFiles.length === 1 ? "" : "s"} into the workbench.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  }

  async function handleReplace(file: File | null) {
    if (!file || !selectedFile) {
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("files", file);
      const response = await fetch("/api/cu/uploads", { method: "POST", body: formData });
      const payload = (await response.json()) as { files?: CuFileRecord[]; error?: string };
      if (!response.ok || !payload.files || payload.files.length !== 1) {
        throw new Error(payload.error || "Replacement file could not be prepared.");
      }

      const replacement = payload.files[0];
      const nextFiles = files.map((record) =>
        record.id === selectedFile.id
          ? {
              ...replacement,
              id: record.id,
              category: record.category,
              track: record.track,
              language: record.language,
              level: record.level,
              status: "pending" as const,
              error: null,
              destination: null,
            }
          : record,
      );

      persist(nextFiles);
      setMessage(`${selectedFile.name} was replaced.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Replacement failed.");
    } finally {
      setBusy(false);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  }

  function updateSelected(patch: Partial<CuFileRecord>) {
    if (!selectedFile) {
      return;
    }

    const nextFiles: CuFileRecord[] = files.map((file) =>
      file.id === selectedFile.id
        ? {
            ...file,
            ...patch,
            status: "pending",
            error: null,
            destination: null,
          }
        : file,
    );
    persist(nextFiles);
  }

  function saveSelectedFile() {
    if (!selectedFile) {
      return;
    }

    persist([...files]);
    setMessage(`${selectedFile.name} was saved to this session.`);
    setError(null);
  }

  async function publish(target: "selected" | "all") {
    const publishable = (target === "all" ? files : selectedFile ? [selectedFile] : []).map((file) => ({
      id: file.id,
      name: file.name,
      extension: file.extension,
      mimeType: file.mimeType,
      size: file.size,
      category: file.category,
      track: file.track,
      language: file.language,
      level: file.level,
      contentBase64: file.isText
        ? toBase64Utf8(file.textContent || "")
        : file.contentBase64,
    })) satisfies CuPublishInput[];

    if (publishable.length === 0) {
      setError("Select at least one file to publish.");
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/cu/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: publishable }),
      });
      const payload = (await response.json()) as PublishResponse & { error?: string };
      if (!response.ok || !payload.results) {
        throw new Error(payload.error || "Publish failed.");
      }

      const resultMap = new Map(payload.results.map((result) => [result.id, result]));
      const nextFiles = files.map((file) => {
        const result = resultMap.get(file.id);
        if (!result) {
          return file;
        }
        return {
          ...file,
          status: result.published ? ("published" as const) : ("error" as const),
          error: result.error || null,
          destination: result.destination,
        };
      });
      persist(nextFiles);
      setPublishMeta({ mode: payload.mode, commitSha: payload.commitSha });
      setMessage(`Published ${payload.results.length} file${payload.results.length === 1 ? "" : "s"}.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Publish failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-[#04101d] px-6 py-10 text-white">
        <div className="mx-auto max-w-md rounded-3xl border border-cyan-500/30 bg-slate-950/80 p-8 shadow-2xl shadow-cyan-950/40">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">CU</p>
          <h1 className="mt-3 text-3xl font-black">Content Upload Workbench</h1>
          <p className="mt-4 text-sm text-slate-300">
            This isolated workbench is protected by one temporary password and does not use the admin or executive dashboards.
          </p>
          <label className="mt-8 block text-sm font-semibold text-slate-200" htmlFor="cu-password">
            Temporary password
          </label>
          <input
            id="cu-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void authenticate();
              }
            }}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
          />
          <button
            type="button"
            onClick={() => void authenticate()}
            disabled={busy}
            className="mt-6 w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy ? "Checking…" : "Enter CU"}
          </button>
          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#04101d] px-4 py-4 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-cyan-500/20 bg-slate-950/90 p-4 shadow-2xl shadow-cyan-950/30 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">CU</p>
            <h1 className="mt-2 text-3xl font-black">Content Upload Workbench</h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-300">
              Upload ZIP, PDF, DOCX, Markdown, TXT, HTML, JSON, and images. Review, edit, replace, delete, save, and publish them without touching admin or executive dashboards.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              Upload files
            </button>
            <button
              type="button"
              onClick={() => persist(files)}
              className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-200"
            >
              Save session
            </button>
            <button
              type="button"
              onClick={() => void publish("selected")}
              disabled={busy || !selectedFile}
              className="rounded-2xl border border-emerald-500/40 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Publish selected
            </button>
            <button
              type="button"
              onClick={() => void publish("all")}
              disabled={busy || files.length === 0}
              className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Publish all
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={CU_UPLOAD_ACCEPT}
          multiple
          className="hidden"
          onChange={(event) => void sendUploads(Array.from(event.target.files || []))}
        />
        <input
          ref={replaceInputRef}
          type="file"
          accept={CU_UPLOAD_ACCEPT}
          className="hidden"
          onChange={(event) => void handleReplace(event.target.files?.[0] || null)}
        />

        <section
          className="mt-6 rounded-[1.75rem] border border-dashed border-cyan-500/30 bg-slate-900/70 px-5 py-8 text-center"
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
          }}
          onDrop={(event) => {
            event.preventDefault();
            void sendUploads(Array.from(event.dataTransfer.files || []));
          }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Drag and drop</p>
          <p className="mt-3 text-lg font-semibold text-white">Drop one file, many files, or a ZIP archive here.</p>
          <p className="mt-2 text-sm text-slate-400">Supported: ZIP, PDF, DOCX, Markdown, TXT, HTML, JSON, images, and multi-file uploads.</p>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Files Uploaded", String(metrics.uploaded)],
            ["Files Pending", String(metrics.pending)],
            ["Files Published", String(metrics.published)],
            ["Errors", String(metrics.errors)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
              <p className="mt-3 text-3xl font-black">{value}</p>
            </div>
          ))}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 md:col-span-2 xl:col-span-1">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Progress Bar</p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${metrics.progress}%` }} />
            </div>
            <p className="mt-3 text-sm font-semibold text-emerald-300">{metrics.progress}% published</p>
          </div>
        </div>

        {message ? <p className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</p> : null}
        {error ? <p className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
        {publishMeta ? (
          <p className="mt-4 text-xs text-slate-400">
            Publisher: {publishMeta.mode}
            {publishMeta.commitSha ? ` · Commit ${publishMeta.commitSha.slice(0, 12)}` : ""}
          </p>
        ) : null}

        <div className="mt-8 grid gap-6 xl:grid-cols-[330px,1fr]">
          <aside className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Workbench Files</h2>
              <span className="text-xs uppercase tracking-[0.25em] text-slate-400">{files.length}</span>
            </div>
            <div className="mt-4 max-h-[70vh] space-y-3 overflow-y-auto pr-1">
              {files.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">No files loaded yet.</div>
              ) : (
                files.map((file) => (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => setSelectedId(file.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      file.id === selectedId
                        ? "border-cyan-400 bg-cyan-500/10"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{file.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{file.relativePath}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                          file.status === "published"
                            ? "bg-emerald-500/15 text-emerald-200"
                            : file.status === "error"
                              ? "bg-rose-500/15 text-rose-200"
                              : "bg-amber-500/15 text-amber-200"
                        }`}
                      >
                        {file.status}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">{file.sourceLabel}</p>
                    {file.destination ? <p className="mt-2 text-xs text-cyan-300">{file.destination}</p> : null}
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5">
            {selectedFile ? (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <h2 className="text-2xl font-black">{selectedFile.name}</h2>
                    <p className="mt-2 text-sm text-slate-400">
                      {selectedFile.mimeType} · {(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.relativePath}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={saveSelectedFile}
                      className="rounded-2xl border border-cyan-500/40 px-4 py-3 text-sm font-semibold text-cyan-200 hover:border-cyan-300"
                    >
                      Save file
                    </button>
                    <button
                      type="button"
                      onClick={() => replaceInputRef.current?.click()}
                      className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold hover:border-cyan-400 hover:text-cyan-200"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const nextFiles = files.filter((file) => file.id !== selectedFile.id);
                        persist(nextFiles);
                        setSelectedId(nextFiles[0]?.id ?? null);
                      }}
                      className="rounded-2xl border border-rose-500/40 px-4 py-3 text-sm font-semibold text-rose-200 hover:border-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <label className="text-sm font-semibold text-slate-200">
                    Content folder
                    <select
                      value={selectedFile.category}
                      onChange={(event) => updateSelected({ category: event.target.value as CuFileRecord["category"] })}
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                    >
                      {CU_CATEGORY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-slate-200">
                    Track folder
                    <select
                      value={selectedFile.track}
                      onChange={(event) => updateSelected({ track: event.target.value as CuFileRecord["track"] })}
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                    >
                      {CU_TRACK_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-slate-200">
                    Level folder
                    <select
                      value={selectedFile.level}
                      onChange={(event) => updateSelected({ level: Number(event.target.value) })}
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                    >
                      {CU_LEVEL_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          Level {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-slate-200">
                    Language folder
                    <select
                      value={selectedFile.language}
                      onChange={(event) => updateSelected({ language: event.target.value as CuFileRecord["language"] })}
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                    >
                      {CU_LANGUAGE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {selectedFile.isText ? (
                  <div className="grid gap-4 xl:grid-cols-2">
                    <div>
                      <label className="text-sm font-semibold text-slate-200" htmlFor="cu-editor">
                        Edit file
                      </label>
                      <textarea
                        id="cu-editor"
                        value={selectedFile.textContent || ""}
                        onChange={(event) => updateSelected({ textContent: event.target.value, contentBase64: selectedFile.contentBase64 })}
                        className="mt-2 min-h-[420px] w-full rounded-[1.5rem] border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-100"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Preview</p>
                      {selectedFile.extension === ".html" || selectedFile.extension === ".htm" ? (
                        <iframe title={`${selectedFile.name} preview`} srcDoc={selectedFile.textContent || ""} className="mt-2 min-h-[420px] w-full rounded-[1.5rem] border border-slate-700 bg-white" />
                      ) : (
                        <pre className="mt-2 min-h-[420px] overflow-auto rounded-[1.5rem] border border-slate-700 bg-slate-950 p-4 text-sm text-slate-200">{selectedFile.textContent}</pre>
                      )}
                    </div>
                  </div>
                ) : selectedFile.mimeType === "application/pdf" ? (
                  <div className="space-y-4">
                    <iframe title={`${selectedFile.name} preview`} src={dataUrl(selectedFile)} className="min-h-[520px] w-full rounded-[1.5rem] border border-slate-700 bg-white" />
                    <div>
                      <label className="text-sm font-semibold text-slate-200" htmlFor="cu-binary-editor-pdf">
                        Edit binary payload
                      </label>
                      <textarea
                        id="cu-binary-editor-pdf"
                        value={selectedFile.contentBase64}
                        onChange={(event) => updateSelected({ contentBase64: event.target.value })}
                        className="mt-2 min-h-[180px] w-full rounded-[1.5rem] border border-slate-700 bg-slate-950 p-4 font-mono text-xs text-slate-100"
                      />
                    </div>
                  </div>
                ) : selectedFile.mimeType.startsWith("image/") ? (
                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-[1.5rem] border border-slate-700 bg-slate-950 p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={dataUrl(selectedFile)} alt={selectedFile.name} className="max-h-[520px] w-full rounded-2xl object-contain" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-200" htmlFor="cu-binary-editor-image">
                        Edit binary payload
                      </label>
                      <textarea
                        id="cu-binary-editor-image"
                        value={selectedFile.contentBase64}
                        onChange={(event) => updateSelected({ contentBase64: event.target.value })}
                        className="mt-2 min-h-[180px] w-full rounded-[1.5rem] border border-slate-700 bg-slate-950 p-4 font-mono text-xs text-slate-100"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 rounded-[1.5rem] border border-slate-700 bg-slate-950 p-5">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Preview</p>
                      <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-300">{selectedFile.previewText || "Preview is available as file metadata only."}</pre>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-200" htmlFor="cu-binary-editor">
                        Edit binary payload
                      </label>
                      <textarea
                        id="cu-binary-editor"
                        value={selectedFile.contentBase64}
                        onChange={(event) => updateSelected({ contentBase64: event.target.value })}
                        className="mt-2 min-h-[180px] w-full rounded-[1.5rem] border border-slate-700 bg-slate-900 p-4 font-mono text-xs text-slate-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/60 p-10 text-center text-slate-400">
                Select an uploaded file to preview, edit, save, replace, delete, or publish it.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
