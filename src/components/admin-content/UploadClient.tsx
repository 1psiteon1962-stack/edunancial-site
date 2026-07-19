"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const COURSE_LEVELS = ["level-1", "level-2", "level-3", "level-4", "level-5"] as const;
const MARKETPLACE_CATEGORIES = [
  "books",
  "ebooks",
  "pdf-guides",
  "templates",
  "worksheets",
  "forms",
  "downloads",
  "zip-packages",
  "audio",
  "videos",
  "images",
  "software",
  "digital-products",
  "calculators",
  "presentations",
  "spreadsheets",
  "future-products",
] as const;

export default function UploadClient() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [contentDestination, setContentDestination] = useState<"" | "courses" | "marketplace">("");
  const [batchName, setBatchName] = useState("");
  const [source, setSource] = useState("Admin dashboard");
  const [notes, setNotes] = useState("");
  const [courseTrack, setCourseTrack] = useState<"red" | "white" | "blue">("red");
  const [courseLevel, setCourseLevel] = useState<(typeof COURSE_LEVELS)[number]>("level-1");
  const [marketplaceCategory, setMarketplaceCategory] = useState<(typeof MARKETPLACE_CATEGORIES)[number]>("books");
  const [language, setLanguage] = useState<"en" | "es" | "fr" | "fr-CA">("en");
  const [membershipAccess, setMembershipAccess] = useState<"free" | "basic" | "premium" | "elite">("basic");
  const [publicationStatus, setPublicationStatus] = useState<"draft" | "review" | "published" | "archived">("draft");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [associatedTrack, setAssociatedTrack] = useState<"" | "red" | "white" | "blue">("");
  const [associatedLevel, setAssociatedLevel] = useState<"" | (typeof COURSE_LEVELS)[number]>("");
  const [csrfToken, setCsrfToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  useEffect(() => {
    void (async () => {
      const sessionResponse = await fetch("/api/admin/auth/session", { cache: "no-store" });
      const payload = await sessionResponse.json();
      setCsrfToken(payload.csrfToken ?? "");
    })();
  }, []);

  function appendFiles(list: FileList | null) {
    if (!list) return;
    setFiles((current) => {
      const seen = new Set(current.map((file) => `${file.name}:${file.size}:${file.lastModified}`));
      const next = [...current];
      for (const file of Array.from(list)) {
        const key = `${file.name}:${file.size}:${file.lastModified}`;
        if (!seen.has(key)) {
          seen.add(key);
          next.push(file);
        }
      }
      return next;
    });
    setError("");
  }

  function validateBeforeUpload() {
    if (!contentDestination) return "Choose CONTENT DESTINATION first.";
    if (!title.trim()) return "Title is required.";
    if (!description.trim()) return "Description is required.";
    if (contentDestination === "courses" && !courseLevel) return "Course level is required.";
    if (contentDestination === "marketplace" && !marketplaceCategory) return "Marketplace category is required.";
    if (files.length === 0) return "Select at least one file.";
    return "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateBeforeUpload();
    if (validation) {
      setError(validation);
      return;
    }
    setUploading(true);
    setError("");
    setSuccess("");
    setProgress(0);
    const formData = new FormData();
    formData.append("batchName", batchName || `Content Upload ${new Date().toISOString().slice(0, 10)}`);
    formData.append("source", source);
    formData.append("notes", notes);
    formData.append("contentDestination", contentDestination);
    formData.append("language", language);
    formData.append("membershipAccess", membershipAccess);
    formData.append("publicationStatus", publicationStatus);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("thumbnailUrl", thumbnailUrl);
    formData.append("previewUrl", previewUrl);
    if (contentDestination === "courses") {
      formData.append("courseTrack", courseTrack);
      formData.append("courseLevel", courseLevel);
    } else {
      formData.append("marketplaceCategory", marketplaceCategory);
      formData.append("associatedTrack", associatedTrack);
      formData.append("associatedLevel", associatedLevel);
    }
    files.forEach((file) => formData.append("files", file));
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable) return;
      setProgress(Math.min(100, Math.round((evt.loaded / evt.total) * 100)));
    };
    xhr.onload = () => {
      setUploading(false);
      if (xhr.status < 200 || xhr.status >= 300) {
        let message = "Upload failed.";
        try {
          const parsed = JSON.parse(xhr.responseText) as { error?: string };
          message = parsed.error ?? message;
        } catch {}
        setError(message);
        return;
      }
      const payload = JSON.parse(xhr.responseText) as { batch: { id: string } };
      setSuccess("Upload successful. Routing to batch review.");
      router.push(`/admin/content/batches/${payload.batch.id}`);
      router.refresh();
    };
    xhr.onerror = () => {
      setUploading(false);
      setError("Network error while uploading.");
    };
    xhr.onabort = () => {
      setUploading(false);
      setError("Upload canceled.");
    };
    xhr.open("POST", "/api/admin/content/upload");
    xhr.setRequestHeader("x-csrf-token", csrfToken);
    xhr.send(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-8">
      <label className="grid gap-2 text-sm font-semibold text-slate-200">
        CONTENT DESTINATION *
        <select
          value={contentDestination}
          onChange={(event) => {
            setContentDestination(event.target.value as "" | "courses" | "marketplace");
            setFiles([]);
            setError("");
            setSuccess("");
          }}
          className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white"
        >
          <option value="">Select destination</option>
          <option value="courses">COURSES</option>
          <option value="marketplace">MARKETPLACE</option>
        </select>
      </label>

      {!contentDestination ? null : (
        <>
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
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          {contentDestination === "courses" ? "Course Title *" : "Marketplace Title *"}
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Language *
          <select value={language} onChange={(event) => setLanguage(event.target.value as "en" | "es" | "fr" | "fr-CA")} className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="fr-CA">French (Canada)</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Membership Access *
          <select value={membershipAccess} onChange={(event) => setMembershipAccess(event.target.value as "free" | "basic" | "premium" | "elite")} className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white">
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
            <option value="elite">Elite</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Publication Status *
          <select value={publicationStatus} onChange={(event) => setPublicationStatus(event.target.value as "draft" | "review" | "published" | "archived")} className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white">
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        {contentDestination === "courses" ? (
          <>
            <label className="grid gap-2 text-sm font-semibold text-slate-200">
              Color Track *
              <select value={courseTrack} onChange={(event) => setCourseTrack(event.target.value as "red" | "white" | "blue")} className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white">
                <option value="red">Red</option>
                <option value="white">White</option>
                <option value="blue">Blue</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-200">
              Course Level *
              <select value={courseLevel} onChange={(event) => setCourseLevel(event.target.value as (typeof COURSE_LEVELS)[number])} className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white">
                {COURSE_LEVELS.map((level) => <option key={level} value={level}>{level.toUpperCase().replace("-", " ")}</option>)}
              </select>
            </label>
          </>
        ) : (
          <>
            <label className="grid gap-2 text-sm font-semibold text-slate-200">
              Marketplace Category *
              <select value={marketplaceCategory} onChange={(event) => setMarketplaceCategory(event.target.value as (typeof MARKETPLACE_CATEGORIES)[number])} className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white">
                {MARKETPLACE_CATEGORIES.map((category) => <option key={category} value={category}>{category.toUpperCase().replaceAll("-", " ")}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-200">
              Optional Course Association
              <div className="grid grid-cols-2 gap-3">
                <select value={associatedTrack} onChange={(event) => setAssociatedTrack(event.target.value as "" | "red" | "white" | "blue")} className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white">
                  <option value="">Track (optional)</option>
                  <option value="red">Red</option>
                  <option value="white">White</option>
                  <option value="blue">Blue</option>
                </select>
                <select value={associatedLevel} onChange={(event) => setAssociatedLevel(event.target.value as "" | (typeof COURSE_LEVELS)[number])} className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white">
                  <option value="">Level (optional)</option>
                  {COURSE_LEVELS.map((level) => <option key={level} value={level}>{level.toUpperCase().replace("-", " ")}</option>)}
                </select>
              </div>
            </label>
          </>
        )}
      </div>

      <label className="grid gap-2 text-sm font-semibold text-slate-200">
        {contentDestination === "courses" ? "Course Description *" : "Marketplace Description *"}
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-28 rounded-2xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Thumbnail (optional URL)
          <input value={thumbnailUrl} onChange={(event) => setThumbnailUrl(event.target.value)} className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          Preview (optional URL)
          <input value={previewUrl} onChange={(event) => setPreviewUrl(event.target.value)} className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-3 text-white" />
        </label>
      </div>

      <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); appendFiles(event.dataTransfer.files); }} className="rounded-3xl border border-dashed border-blue-400/50 bg-[#101a2f] p-10 text-center text-slate-300">
        <p className="text-lg font-semibold text-white">Drag and drop files or ZIP packages</p>
        <p className="mt-2 text-sm">Allowed: documents, media, images, JSON/CSV, and ZIP bundles up to 50 MB per file.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500">Choose files</button>
          {uploading ? <button type="button" onClick={() => xhrRef.current?.abort()} className="rounded-xl border border-white/15 px-5 py-3 font-semibold">Cancel upload</button> : null}
        </div>
        <input ref={fileInputRef} type="file" multiple onChange={(event) => appendFiles(event.target.files)} className="hidden" />
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#101a2f] p-6">
        <h2 className="text-xl font-bold text-white">Selected files</h2>
        <ul className="mt-4 grid gap-3 text-sm text-slate-300">
          {files.length === 0 ? <li>No files selected.</li> : files.map((file) => <li key={`${file.name}-${file.size}`}>{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB {file.name.toLowerCase().endsWith('.zip') ? '· ZIP archive' : ''}</li>)}
        </ul>
      </div>

      {error ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
      {success ? <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{success}</p> : null}
      {uploading ? <p className="text-sm text-slate-300">Upload progress: {progress}%</p> : null}
      <button disabled={uploading || files.length === 0} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-60">{uploading ? 'Uploading…' : 'Upload batch'}</button>
      </>
      )}
    </form>
  );
}
