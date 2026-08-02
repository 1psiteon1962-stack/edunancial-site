import type { Metadata } from "next";
import Link from "next/link";

import { listTracks } from "@/lib/curriculum/reader";

export const metadata: Metadata = {
  title: "Curriculum | Edunancial",
  description:
    "Browse the complete Edunancial curriculum — production lessons across Real Estate, Paper Assets, Business, and more.",
  openGraph: {
    title: "Curriculum | Edunancial",
    description:
      "Production-ready financial education curriculum. Real Estate, Paper Assets, Business, and more.",
    type: "website",
    siteName: "Edunancial",
  },
};

const TRACK_META: Record<
  string,
  {
    subtitle: string;
    bg: string;
    border: string;
    badge: string;
    heading: string;
  }
> = {
  RED: {
    subtitle: "Real estate investing: rentals, tax liens, tax deeds, and creative financing.",
    bg: "bg-red-950/40",
    border: "border-red-500/30 hover:border-red-400/60",
    badge: "bg-red-500/20 text-red-300 border border-red-500/40",
    heading: "text-red-400",
  },
  WHITE: {
    subtitle: "Paper asset investing: stocks, bonds, ETFs, and retirement accounts.",
    bg: "bg-slate-800/40",
    border: "border-slate-600/30 hover:border-slate-500/60",
    badge: "bg-slate-500/20 text-slate-300 border border-slate-500/40",
    heading: "text-slate-200",
  },
  BLUE: {
    subtitle: "Business competency: starting, growing, and managing a business.",
    bg: "bg-blue-950/40",
    border: "border-blue-500/30 hover:border-blue-400/60",
    badge: "bg-blue-500/20 text-blue-300 border border-blue-500/40",
    heading: "text-blue-400",
  },
};

const DEFAULT_META = {
  subtitle: "",
  bg: "bg-slate-900/40",
  border: "border-slate-700/30 hover:border-slate-600/60",
  badge: "bg-slate-600/20 text-slate-300 border border-slate-600/40",
  heading: "text-slate-200",
};

export default function CurriculumIndexPage() {
  const tracks = listTracks();

  const totalLessons = tracks.reduce(
    (sum, t) => sum + t.levels.reduce((s, l) => s + l.lessonCount, 0),
    0
  );
  const publishedCount = tracks.filter((t) =>
    t.levels.some((l) => l.lessonCount > 0)
  ).length;

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Edunancial
        </p>
        <h1 className="mt-4 text-5xl font-black md:text-7xl leading-tight">
          Curriculum
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
          Production financial education. Every lesson delivers practical knowledge
          you can apply to your financial decisions. Browse by academy below.
        </p>

        {totalLessons > 0 && (
          <p className="mt-4 text-sm text-slate-500">
            {totalLessons} lesson{totalLessons !== 1 ? "s" : ""} published across{" "}
            {publishedCount} academy{publishedCount !== 1 ? " academies" : ""}
          </p>
        )}
      </section>

      {/* All three academies — always visible */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-2xl font-black mb-6">Academies</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => {
            const meta = TRACK_META[track.code] ?? DEFAULT_META;
            const totalLessonsInTrack = track.levels.reduce(
              (sum, l) => sum + l.lessonCount,
              0
            );
            const hasLessons = totalLessonsInTrack > 0;
            const publishedLevels = track.levels.filter((l) => l.lessonCount > 0).length;

            return (
              <Link
                key={track.code}
                href={`/curriculum/${track.code.toLowerCase()}`}
                className={`rounded-2xl border p-6 transition group ${meta.bg} ${meta.border}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${meta.badge}`}
                  >
                    {track.code}
                  </span>
                  {!hasLessons && (
                    <span className="text-xs font-bold text-slate-500 border border-slate-700 rounded-full px-2 py-0.5">
                      Coming Soon
                    </span>
                  )}
                </div>
                <h3
                  className={`text-2xl font-black transition group-hover:opacity-80 ${meta.heading}`}
                >
                  {track.name}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {meta.subtitle}
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  {hasLessons
                    ? `${totalLessonsInTrack} lesson${totalLessonsInTrack !== 1 ? "s" : ""} · ${publishedLevels} level${publishedLevels !== 1 ? "s" : ""} available`
                    : `${track.levels.length} level${track.levels.length !== 1 ? "s" : ""} · lessons in preparation`}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
