"use client";

import { useState } from "react";
import Link from "next/link";

interface LessonRow {
  id: string;
  track: string;
  trackName: string;
  level: number;
  lessonNumber: number;
  title: string;
  summary: string;
  status: string;
  visibility: string;
  importedAt: string;
  hasContent: boolean;
  warnings: string[];
  unlockedByTiers: string[];
  contentUrl: string;
  editUrl: string;
}

interface Props {
  rows: LessonRow[];
  tracks: string[];
  csrfToken: string;
  totalLessons: number;
  totalTracks: number;
}

const TRACK_COLORS: Record<string, string> = {
  RED: "bg-red-500/20 text-red-300 border-red-500/40",
  WHITE: "bg-slate-500/20 text-slate-300 border-slate-500/40",
  BLUE: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  GREEN: "bg-green-500/20 text-green-300 border-green-500/40",
  GOLD: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
};

function VisibilityBadge({ visibility }: { visibility: string }) {
  const styles: Record<string, string> = {
    free_preview: "bg-green-500/20 text-green-300 border border-green-500/40",
    public_preview: "bg-blue-500/20 text-blue-300 border border-blue-500/40",
    members_only: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40",
  };
  const labels: Record<string, string> = {
    free_preview: "Free Preview",
    public_preview: "Public Preview",
    members_only: "Members Only",
  };
  const cls = styles[visibility] ?? "bg-slate-500/20 text-slate-400 border border-slate-500/40";
  const label = labels[visibility] ?? visibility;
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${cls}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-green-500/20 text-green-300 border border-green-500/40",
    archived: "bg-slate-600/20 text-slate-400 border border-slate-600/40",
    superseded: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
    unknown: "bg-red-500/20 text-red-400 border border-red-500/40",
  };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${map[status] ?? map.unknown}`}>
      {status}
    </span>
  );
}

export default function CurriculumDashboardClient({ rows, tracks, csrfToken, totalLessons, totalTracks }: Props) {
  const [filterTrack, setFilterTrack] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const allLevels = Array.from(new Set(rows.map((r) => r.level))).sort((a, b) => a - b);

  const filtered = rows.filter(
    (r) =>
      !deletedIds.has(r.id) &&
      (filterTrack === "all" || r.track === filterTrack) &&
      (filterLevel === "all" || r.level === Number(filterLevel)),
  );

  async function handleDelete(lessonId: string) {
    setDeleting(lessonId);
    setDeleteError(null);
    try {
      const res = await fetch("/api/admin/curriculum/delete-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ lessonId }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (data.ok) {
        setDeletedIds((prev: Set<string>) => new Set([...prev, lessonId]));
        setConfirmDelete(null);
      } else {
        setDeleteError(data.error ?? "Delete failed");
      }
    } catch (err) {
      setDeleteError(String(err));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-sm text-slate-500">Published Lessons</p>
          <p className="mt-1 text-3xl font-black text-green-400">{totalLessons - deletedIds.size}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-sm text-slate-500">Active Tracks</p>
          <p className="mt-1 text-3xl font-black text-blue-400">{totalTracks}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-sm text-slate-500">Filtered Rows</p>
          <p className="mt-1 text-3xl font-black text-yellow-400">{filtered.length}</p>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          {/* Track filter */}
          <select
            value={filterTrack}
            onChange={(e) => setFilterTrack(e.target.value)}
            className="rounded-xl bg-slate-800 border border-slate-700 text-white px-3 py-2 text-sm"
          >
            <option value="all">All Tracks</option>
            {tracks.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {/* Level filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="rounded-xl bg-slate-800 border border-slate-700 text-white px-3 py-2 text-sm"
          >
            <option value="all">All Levels</option>
            {allLevels.map((l) => <option key={l} value={l}>Level {l}</option>)}
          </select>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/curriculum/tier-config"
            className="rounded-xl border border-yellow-500/40 px-4 py-2 text-sm font-semibold text-yellow-300 hover:border-yellow-400 transition"
          >
            ⚙ Tier Config
          </Link>
          <Link
            href="/admin/curriculum/add"
            className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-black text-black hover:bg-yellow-400 transition"
          >
            + Add Lesson
          </Link>
        </div>
      </div>

      {deleteError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {deleteError}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="rounded-2xl bg-slate-900 border border-red-500/40 p-8 max-w-sm w-full space-y-4">
            <h2 className="text-xl font-black text-red-400">Delete Lesson?</h2>
            <p className="text-slate-300 text-sm">
              This will permanently delete <code className="text-yellow-300 text-xs">{confirmDelete}</code> from the
              file system and registry. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting === confirmDelete}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white hover:bg-red-500 disabled:opacity-50 transition"
              >
                {deleting === confirmDelete ? "Deleting…" : "Yes, Delete"}
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 text-center text-slate-500 text-sm">
          No lessons match the current filters.
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                <th className="px-4 py-3 text-left text-slate-400 font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-slate-400 font-semibold">Track</th>
                <th className="px-4 py-3 text-left text-slate-400 font-semibold">Lvl</th>
                <th className="px-4 py-3 text-left text-slate-400 font-semibold">#</th>
                <th className="px-4 py-3 text-left text-slate-400 font-semibold">Title</th>
                <th className="px-4 py-3 text-left text-slate-400 font-semibold">Visibility</th>
                <th className="px-4 py-3 text-left text-slate-400 font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-slate-400 font-semibold">Unlocked by</th>
                <th className="px-4 py-3 text-left text-slate-400 font-semibold">Modified</th>
                <th className="px-4 py-3 text-left text-slate-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((row, idx) => {
                const badgeColor = TRACK_COLORS[row.track] ?? "bg-slate-600/20 text-slate-300 border-slate-600/40";
                return (
                  <tr key={row.id} className={idx % 2 === 0 ? "bg-slate-900/20" : "bg-slate-900/40"}>
                    <td className="px-4 py-3">
                      <code className="text-xs text-slate-400 font-mono">{row.id}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${badgeColor}`}>
                        {row.track}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-center">{row.level}</td>
                    <td className="px-4 py-3 text-slate-400 text-center">{row.lessonNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white leading-snug">{row.title}</p>
                      {row.summary && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{row.summary}</p>
                      )}
                      {row.warnings.length > 0 && (
                        <p className="text-xs text-red-400 mt-0.5">⚠ {row.warnings.join("; ")}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <VisibilityBadge visibility={row.visibility} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {row.unlockedByTiers.length === 0 ? (
                          <span className="text-xs text-slate-600">Free preview</span>
                        ) : (
                          row.unlockedByTiers.map((t) => (
                            <span key={t} className="text-xs bg-slate-700 text-slate-300 rounded px-1.5 py-0.5">{t}</span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {row.importedAt ? new Date(row.importedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={row.contentUrl}
                          className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View ↗
                        </Link>
                        <Link
                          href={row.editUrl}
                          className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(row.id)}
                          className="text-xs text-red-400 hover:text-red-300 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
