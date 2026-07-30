"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  getProductionCatalog,
  EXPECTED_TRACKS,
} from "@/lib/production-catalog";
import { NORTH_AMERICA_TRACKS } from "@/lib/adaptive-learning";

const trackKeys = Object.keys(NORTH_AMERICA_TRACKS) as Array<
  keyof typeof NORTH_AMERICA_TRACKS
>;

export default function CourseCatalogPage() {
  const productionCatalog = useMemo(() => getProductionCatalog(), []);
  const [search, setSearch] = useState("");
  const [activeTrack, setActiveTrack] = useState<string>("All");

  const filtered = useMemo(() => {
    return productionCatalog.filter((entry) => {
      const matchesSearch =
        search === "" ||
        entry.title.toLowerCase().includes(search.toLowerCase()) ||
        entry.lessons.some((l) =>
          l.title.toLowerCase().includes(search.toLowerCase()),
        );
      const matchesTrack =
        activeTrack === "All" || entry.trackCode === activeTrack;
      return matchesSearch && matchesTrack;
    });
  }, [search, activeTrack, productionCatalog]);

  const isEmpty = productionCatalog.length === 0;

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400 text-sm">
          COURSE CATALOG
        </p>
        <h1 className="mt-4 text-5xl font-black md:text-6xl">
          Explore Every Course
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          {isEmpty
            ? "No production curriculum has been registered yet."
            : `${productionCatalog.length} track${productionCatalog.length !== 1 ? "s" : ""} across Real Estate, Paper Assets, Business, and more.`}
        </p>

        {!isEmpty && (
          <>
            {/* Search */}
            <div className="mt-10 relative max-w-2xl">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses or lessons…"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>
            </div>

            {/* Track filters */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTrack("All")}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                  activeTrack === "All"
                    ? "bg-yellow-500 text-black"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                All Tracks
              </button>
              {trackKeys.map((code) => (
                <button
                  key={code}
                  onClick={() => setActiveTrack(code)}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                    activeTrack === code
                      ? "bg-yellow-500 text-black"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {NORTH_AMERICA_TRACKS[code]}
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Catalog body */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        {isEmpty ? (
          /* ── No registered curriculum ── */
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-8">
            <h2 className="text-2xl font-black text-yellow-400">
              No Production Curriculum Registered
            </h2>
            <p className="mt-4 text-slate-300">
              The curriculum registry is empty. No lessons have been imported
              into the production pipeline.
            </p>
            <p className="mt-6 text-slate-400 text-sm font-bold uppercase tracking-widest">
              Expected curriculum locations — files missing:
            </p>
            <ul className="mt-3 space-y-2">
              {EXPECTED_TRACKS.map((t) => (
                <li key={t.code} className="font-mono text-sm text-red-400">
                  ✗ {t.expectedPath}*.md — {t.name} lessons not found
                </li>
              ))}
            </ul>
            <p className="mt-8 text-slate-400 text-sm">
              To publish curriculum: place approved{" "}
              <code className="text-yellow-300">.md</code> lesson files in the
              locations above, then run{" "}
              <code className="text-yellow-300">npm run curriculum:import</code>
              .
            </p>
          </div>
        ) : filtered.length === 0 ? (
          /* ── Search returned nothing ── */
          <div className="py-20 text-center text-slate-400">
            <p className="text-2xl font-bold">No courses match your search.</p>
            <button
              onClick={() => {
                setSearch("");
                setActiveTrack("All");
              }}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* ── Production course cards ── */
          <>
            <p className="mb-8 text-slate-400 text-sm">
              Showing {filtered.length} of {productionCatalog.length}{" "}
              track{productionCatalog.length !== 1 ? "s" : ""}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/courses/${entry.id}`}
                  className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-600 transition"
                >
                  {/* Track colour bar */}
                  <div className={`h-2 w-full ${entry.colorClass}`} />
                  <div className="p-6">
                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-bold text-slate-300">
                      {entry.trackCode}
                    </span>
                    <h2 className="mt-4 text-xl font-black group-hover:text-yellow-400 transition">
                      {entry.title}
                    </h2>
                    {/* Lesson list preview */}
                    {entry.lessons.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {entry.lessons.slice(0, 3).map((lesson) => (
                          <li
                            key={lesson.id}
                            className="text-sm text-slate-400 truncate"
                          >
                            · {lesson.title}
                          </li>
                        ))}
                        {entry.lessons.length > 3 && (
                          <li className="text-xs text-slate-500">
                            +{entry.lessons.length - 3} more
                          </li>
                        )}
                      </ul>
                    )}
                    {/* Meta */}
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>📚 {entry.lessonCount} lesson{entry.lessonCount !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
