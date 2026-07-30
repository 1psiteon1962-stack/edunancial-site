import type { Metadata } from "next";
import Link from "next/link";

import { requireAdminPageSession } from "@/lib/admin-content/auth";
import {
  getCurriculumSearchIndex,
  getLessonContent,
  listTracks,
} from "@/lib/curriculum/reader";

export const metadata: Metadata = {
  title: "Curriculum Review | Edunancial Admin",
  robots: { index: false, follow: false },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LessonRow {
  id: string;
  track: string;
  trackName: string;
  level: number;
  lessonNumber: number;
  title: string;
  summary: string;
  status: string;
  author: string;
  date: string;
  contentUrl: string;
  adminUrl: string;
  hasContent: boolean;
  warnings: string[];
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CurriculumReviewPage() {
  await requireAdminPageSession();

  const tracks = listTracks();
  const searchIndex = getCurriculumSearchIndex();

  // Build detailed lesson rows
  const rows: LessonRow[] = searchIndex.map((entry) => {
    const content = getLessonContent(entry.id);
    const trackData = tracks.find((t) => t.code === entry.track);
    const levelData = trackData?.levels.find((l) => l.level === entry.level);
    const meta = levelData?.lessons.find((l) => l.id === entry.id);

    return {
      id: entry.id,
      track: entry.track,
      trackName: entry.trackName,
      level: entry.level,
      lessonNumber: entry.lessonNumber,
      title: entry.title,
      summary: entry.summary,
      status: meta?.status ?? "unknown",
      author: meta?.author ?? "",
      date: meta?.date ?? "",
      contentUrl: entry.url,
      adminUrl: entry.url, // same for now
      hasContent: content !== null,
      warnings: meta ? [] : ["Lesson not found in registry"],
    };
  });

  const publishedCount = rows.filter((r) => r.status === "active").length;
  const totalTracks = tracks.length;
  const publishedTracks = tracks.filter((t) =>
    t.levels.some((l) => l.lessonCount > 0)
  ).length;

  // Group by track
  const byTrack = tracks.map((track) => ({
    ...track,
    rows: rows.filter((r) => r.track === track.code),
  }));

  const TRACK_COLORS: Record<string, string> = {
    RED: "bg-red-500/20 text-red-300 border-red-500/40",
    WHITE: "bg-slate-500/20 text-slate-300 border-slate-500/40",
    BLUE: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    GREEN: "bg-green-500/20 text-green-300 border-green-500/40",
    GOLD: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    PURPLE: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    ORANGE: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    BLACK: "bg-slate-600/20 text-slate-200 border-slate-600/40",
  };

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-400 mb-1">Owner Review</p>
            <h1 className="text-4xl font-black">Curriculum Dashboard</h1>
            <p className="mt-2 text-slate-400">
              Review every lesson exactly as members see it. Verify publication status,
              navigation, and content quality.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/curriculum"
              className="rounded-xl border border-blue-500/40 px-5 py-3 text-sm font-semibold text-blue-300 hover:border-blue-400 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              View as Member ↗
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <StatCard label="Published Lessons" value={publishedCount} color="text-green-400" />
          <StatCard label="Total Tracks" value={totalTracks} color="text-blue-400" />
          <StatCard label="Active Tracks" value={publishedTracks} color="text-yellow-400" />
          <StatCard
            label="Tracks Coming Soon"
            value={totalTracks - publishedTracks}
            color="text-slate-400"
          />
        </div>

        {/* How to add new lessons */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 mb-10">
          <h2 className="font-black text-blue-300 mb-2">📋 How to Add New Lessons</h2>
          <ol className="space-y-1 text-sm text-slate-300 list-decimal list-inside">
            <li>
              Write the lesson as a markdown file with the required front-matter (see format below)
            </li>
            <li>
              Run: <code className="bg-slate-800 text-yellow-300 px-2 py-0.5 rounded text-xs font-mono">npm run curriculum:import -- /path/to/lesson.md</code>
            </li>
            <li>The lesson is automatically registered, indexed, and visible at its URL</li>
            <li>No code changes required</li>
          </ol>
          <details className="mt-4">
            <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-300">
              Show required front-matter format
            </summary>
            <pre className="mt-2 bg-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto">
{`---
id: RED-L1-011
track: RED
officialTrackName: Real Estate
level: 1
lessonNumber: 11
title: Your Lesson Title Here
version: 1.0
author: Edunancial Faculty
date: YYYY-MM-DD
summary: One or two sentence summary of the lesson.
---

## Learning Objectives
...

## Core Content
...`}
            </pre>
          </details>
        </div>

        {/* Tracks */}
        {byTrack.map((track) => {
          const badgeColor = TRACK_COLORS[track.code] ?? "bg-slate-600/20 text-slate-300 border-slate-600/40";
          return (
            <div key={track.code} className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${badgeColor}`}>
                  {track.code}
                </span>
                <h2 className="text-xl font-black">{track.name}</h2>
                <span className="text-sm text-slate-500">
                  {track.rows.length > 0
                    ? `${track.rows.length} lesson${track.rows.length !== 1 ? "s" : ""} published`
                    : "No lessons yet"}
                </span>
                {track.rows.length > 0 && (
                  <Link
                    href={`/curriculum/${track.code.toLowerCase()}`}
                    className="text-xs text-yellow-400 hover:text-yellow-300 ml-auto"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Track ↗
                  </Link>
                )}
              </div>

              {track.rows.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 text-center">
                  <p className="text-slate-500 text-sm">No lessons published yet. Use <code className="text-yellow-300">npm run curriculum:import</code> to add the first lesson.</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80">
                        <th className="px-4 py-3 text-left text-slate-400 font-semibold w-28">ID</th>
                        <th className="px-4 py-3 text-left text-slate-400 font-semibold">Title</th>
                        <th className="px-4 py-3 text-left text-slate-400 font-semibold w-20">Level</th>
                        <th className="px-4 py-3 text-left text-slate-400 font-semibold w-16">Lesson</th>
                        <th className="px-4 py-3 text-left text-slate-400 font-semibold w-24">Status</th>
                        <th className="px-4 py-3 text-left text-slate-400 font-semibold w-20">Content</th>
                        <th className="px-4 py-3 text-left text-slate-400 font-semibold w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {track.rows.map((row, idx) => (
                        <tr
                          key={row.id}
                          className={idx % 2 === 0 ? "bg-slate-900/20" : "bg-slate-900/40"}
                        >
                          <td className="px-4 py-3">
                            <code className="text-xs text-slate-400 font-mono">{row.id}</code>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-white leading-snug">{row.title}</p>
                            {row.summary && (
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{row.summary}</p>
                            )}
                            {row.warnings.length > 0 && (
                              <p className="text-xs text-red-400 mt-0.5">⚠ {row.warnings.join("; ")}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-400">{row.level}</td>
                          <td className="px-4 py-3 text-slate-400">{row.lessonNumber}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={row.status} />
                          </td>
                          <td className="px-4 py-3">
                            {row.hasContent ? (
                              <span className="text-green-400 text-xs font-semibold">✓ Ready</span>
                            ) : (
                              <span className="text-red-400 text-xs font-semibold">✗ Missing</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              href={row.contentUrl}
                              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View ↗
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}

        {/* Registry metadata */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
          <h3 className="font-black text-slate-400 mb-2">Registry Information</h3>
          <p className="text-xs text-slate-600">
            Registry is updated automatically by <code className="text-yellow-300">npm run curriculum:import</code>.
            No manual registry editing required.
          </p>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-green-500/20 text-green-300 border border-green-500/40",
    archived: "bg-slate-600/20 text-slate-400 border border-slate-600/40",
    superseded: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
    unknown: "bg-red-500/20 text-red-400 border border-red-500/40",
  };
  const cls = map[status] ?? map.unknown;
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}
