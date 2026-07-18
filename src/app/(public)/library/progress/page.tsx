"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { UserProgress } from "@/lib/library/libraryTypes";
import ProgressBar from "@/components/library/ProgressBar";

interface ProgressWithTitle extends UserProgress {
  itemTitle?: string;
  itemType?: string;
}

export default function ProgressPage() {
  const [records, setRecords] = useState<ProgressWithTitle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/library/progress?userId=demo");
      const data = await res.json();
      const prog: UserProgress[] = data.progress ?? [];

      const enriched = await Promise.all(
        prog.map(async (p) => {
          const r = await fetch(`/api/library/items/${p.itemId}`);
          const item = r.ok ? await r.json() : undefined;
          return { ...p, itemTitle: item?.title, itemType: item?.type };
        })
      );
      setRecords(enriched);
      setLoading(false);
    }
    load();
  }, []);

  function formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-5xl px-6 py-20">

        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
          <Link href="/library" className="hover:text-white">Library</Link>
          <span className="mx-2">›</span>
          <span>My Progress</span>
        </nav>

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">MY LIBRARY</p>
        <h1 className="mt-4 text-5xl font-black">My Progress</h1>
        <p className="mt-4 text-slate-400">
          Track your reading, listening, and viewing history.
        </p>

        {loading ? (
          <div className="mt-16 text-slate-400">Loading…</div>
        ) : records.length === 0 ? (
          <div className="mt-16 rounded-2xl bg-slate-900 p-12 text-center">
            <p className="text-2xl font-bold">No progress yet.</p>
            <p className="mt-4 text-slate-400">
              Start reading or watching from the{" "}
              <Link href="/library" className="text-blue-400 hover:underline">library</Link>.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {records.map((rec) => (
              <div key={rec.itemId} className="rounded-xl bg-slate-900 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    {rec.itemType && (
                      <p className="text-xs uppercase tracking-widest text-yellow-400 mb-1">
                        {rec.itemType}
                      </p>
                    )}
                    <Link
                      href={`/library/${rec.itemId}`}
                      className="text-xl font-bold hover:text-blue-400 transition"
                    >
                      {rec.itemTitle ?? rec.itemId}
                    </Link>
                    <div className="mt-1 flex flex-wrap gap-4 text-sm text-slate-400">
                      <span>Position: <span className="text-white">{rec.positionReference}</span></span>
                      <span>Time spent: <span className="text-white">{formatTime(rec.timeSpentSeconds)}</span></span>
                      <span>Last opened: <span className="text-white">{new Date(rec.lastAccessedAt).toLocaleDateString()}</span></span>
                    </div>
                  </div>
                  {rec.completed && (
                    <span className="shrink-0 rounded-full bg-green-700 px-3 py-1 text-xs font-bold text-green-100">
                      Completed
                    </span>
                  )}
                </div>

                <ProgressBar
                  percent={rec.progressPercent}
                  label={`${rec.progressPercent}% complete`}
                />

                <div className="mt-4">
                  <Link
                    href={`/library/${rec.itemId}`}
                    className="text-sm text-blue-400 hover:underline"
                  >
                    Resume →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
