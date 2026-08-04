"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  csrfToken: string;
}

const TRACKS = ["RED", "WHITE", "BLUE"];

const DEFAULT_BODY = `## Learning Objectives

By the end of this lesson you will be able to:

- Objective 1
- Objective 2
- Objective 3

## Core Content

### Introduction

Write the main lesson content here.

## Common Mistakes

- Mistake 1
- Mistake 2

## Apply This Knowledge

Practical application steps.
`;

export default function AddLessonClient({ csrfToken }: Props) {
  const router = useRouter();
  const [track, setTrack] = useState("RED");
  const [level, setLevel] = useState(1);
  const [lessonNumber, setLessonNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [author, setAuthor] = useState("Edunancial Faculty");
  const [body, setBody] = useState(DEFAULT_BODY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch("/api/admin/curriculum/add-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ track, level, lessonNumber, title, summary, author, content: body }),
      });
      const data = await res.json() as { ok?: boolean; error?: string; lessonId?: string };
      if (data.ok) {
        router.push("/admin/curriculum");
      } else {
        setError(data.error ?? "Failed to add lesson");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  const previewId = `${track}-L${level}-${String(lessonNumber).padStart(3, "0")}`;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/curriculum" className="text-sm text-yellow-400 hover:text-yellow-300">
          ← Back to Curriculum Dashboard
        </Link>
      </div>

      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-yellow-400 mb-1">Admin</p>
        <h1 className="text-4xl font-black">Add New Lesson</h1>
        <p className="mt-2 text-slate-400">
          Add a single lesson directly. Access behavior is automatically determined by the lesson&apos;s
          track, level, and lesson number — no manual visibility configuration required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lesson ID preview */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-sm">
          <span className="text-slate-400">Lesson ID will be: </span>
          <code className="text-yellow-300 font-mono font-black">{previewId}</code>
          {level === 1 && lessonNumber <= 3 ? (
            <span className="ml-3 text-xs bg-green-500/20 text-green-300 border border-green-500/40 rounded-full px-2 py-0.5">
              Free Preview
            </span>
          ) : (
            <span className="ml-3 text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 rounded-full px-2 py-0.5">
              Members Only (tier-gated)
            </span>
          )}
        </div>

        {/* Track / Level / Lesson Number */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Track</label>
            <select
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-3 py-2"
            >
              {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Level</label>
            <input
              type="number"
              min={1}
              max={5}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Lesson Number</label>
            <input
              type="number"
              min={1}
              max={999}
              value={lessonNumber}
              onChange={(e) => setLessonNumber(Number(e.target.value))}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-3 py-2"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Lesson title"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-3 py-2"
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1">Summary (optional)</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            placeholder="One or two sentence summary"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-3 py-2 resize-y"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-3 py-2"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1">
            Lesson Body (Markdown)
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={20}
            required
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-3 py-2 font-mono text-sm resize-y"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-yellow-500 px-8 py-3 font-black text-black hover:bg-yellow-400 disabled:opacity-50 transition"
          >
            {saving ? "Adding…" : "Add Lesson"}
          </button>
          <Link
            href="/admin/curriculum"
            className="rounded-xl border border-slate-600 px-8 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-400 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
