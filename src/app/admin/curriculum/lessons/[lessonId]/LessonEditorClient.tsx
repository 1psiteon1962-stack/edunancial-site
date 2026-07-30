"use client";

import Link from "next/link";
import { useState } from "react";

interface Props {
  lessonId: string;
  initialContent: string;
  filePath: string;
  previewUrl: string | null;
  editorEmail: string;
}

export default function LessonEditorClient({
  lessonId,
  initialContent,
  filePath,
  previewUrl,
  editorEmail,
}: Props) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("edunancial_admin_csrf="))
        ?.split("=")[1] ?? "";

      const res = await fetch("/api/admin/curriculum/save-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ lessonId, content }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "Lesson saved successfully." });
      } else {
        setStatus({ type: "error", message: data.error ?? "Save failed." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Could not save." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete lesson ${lessonId}? This cannot be undone.`)) return;
    setSaving(true);
    setStatus(null);
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("edunancial_admin_csrf="))
        ?.split("=")[1] ?? "";

      const res = await fetch("/api/admin/curriculum/delete-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ lessonId }),
      });

      const data = await res.json();
      if (res.ok) {
        window.location.href = "/admin/curriculum";
      } else {
        setStatus({ type: "error", message: data.error ?? "Delete failed." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Could not delete." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-[#0c1422] px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/admin/curriculum" className="text-sm text-slate-400 hover:text-white">
            ← Curriculum
          </Link>
          <span className="text-slate-600">/</span>
          <span className="font-mono text-sm text-white">{lessonId}</span>
        </div>
        <div className="text-xs text-slate-500">
          Editing as <strong className="text-slate-400">{editorEmail}</strong>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* File path */}
        <p className="text-xs text-slate-500 font-mono mb-6">{filePath}</p>

        {/* Status banner */}
        {status && (
          <div
            className={`mb-6 rounded-xl px-5 py-4 text-sm font-semibold ${
              status.type === "success"
                ? "bg-green-900/40 border border-green-700/40 text-green-300"
                : "bg-red-900/40 border border-red-700/40 text-red-300"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Editor */}
        <div className="rounded-2xl border border-white/10 bg-[#0c1422] overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-white/10">
            <span className="text-sm font-semibold text-slate-300">Markdown Editor</span>
            <div className="flex gap-3">
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-600 px-4 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-400"
                >
                  Preview ↗
                </a>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-blue-700 px-5 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent px-6 py-5 font-mono text-sm text-slate-200 leading-relaxed resize-none focus:outline-none"
            rows={40}
            spellCheck={false}
          />
        </div>

        {/* Danger zone */}
        <div className="mt-12 rounded-2xl border border-red-900/40 bg-red-950/20 p-6">
          <h2 className="text-lg font-black text-red-400 mb-2">Danger Zone</h2>
          <p className="text-sm text-slate-400 mb-4">
            Permanently deletes the lesson file from the filesystem. This action cannot be undone.
          </p>
          <button
            onClick={handleDelete}
            disabled={saving}
            className="rounded-xl bg-red-700 px-6 py-3 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50"
          >
            Delete Lesson
          </button>
        </div>
      </div>
    </main>
  );
}
