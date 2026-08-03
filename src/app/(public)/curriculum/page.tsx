import type { Metadata } from "next";
import Link from "next/link";

import { listAcademies } from "@/lib/curriculum/reader";

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

const TRACK_STYLES: Record<
  string,
  { bg: string; border: string; badge: string; heading: string }
> = {
  RED: {
    bg: "bg-red-950/40",
    border: "border-red-500/30 hover:border-red-400/60",
    badge: "bg-red-500/20 text-red-300 border border-red-500/40",
    heading: "text-red-400",
  },
  WHITE: {
    bg: "bg-slate-800/40",
    border: "border-slate-600/30 hover:border-slate-500/60",
    badge: "bg-slate-500/20 text-slate-300 border border-slate-500/40",
    heading: "text-slate-200",
  },
  BLUE: {
    bg: "bg-blue-950/40",
    border: "border-blue-500/30 hover:border-blue-400/60",
    badge: "bg-blue-500/20 text-blue-300 border border-blue-500/40",
    heading: "text-blue-400",
  },
  GREEN: {
    bg: "bg-green-950/40",
    border: "border-green-500/30 hover:border-green-400/60",
    badge: "bg-green-500/20 text-green-300 border border-green-500/40",
    heading: "text-green-400",
  },
  GOLD: {
    bg: "bg-yellow-950/40",
    border: "border-yellow-500/30 hover:border-yellow-400/60",
    badge: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40",
    heading: "text-yellow-400",
  },
  PURPLE: {
    bg: "bg-purple-950/40",
    border: "border-purple-500/30 hover:border-purple-400/60",
    badge: "bg-purple-500/20 text-purple-300 border border-purple-500/40",
    heading: "text-purple-400",
  },
  ORANGE: {
    bg: "bg-orange-950/40",
    border: "border-orange-500/30 hover:border-orange-400/60",
    badge: "bg-orange-500/20 text-orange-300 border border-orange-500/40",
    heading: "text-orange-400",
  },
  BLACK: {
    bg: "bg-slate-900/60",
    border: "border-slate-400/30 hover:border-slate-300/60",
    badge: "bg-slate-400/20 text-slate-200 border border-slate-400/40",
    heading: "text-slate-200",
  },
};

const DEFAULT_STYLE = {
  bg: "bg-slate-900/40",
  border: "border-slate-700/30 hover:border-slate-600/60",
  badge: "bg-slate-600/20 text-slate-300 border border-slate-600/40",
  heading: "text-slate-200",
};

export default function CurriculumIndexPage() {
  const academies = listAcademies();

  const totalLessons = academies.reduce(
    (sum, a) => sum + a.levels.reduce((s, l) => s + l.lessonCount, 0),
    0
  );

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
            {academies.length} academy{academies.length !== 1 ? " academies" : ""}
          </p>
        )}
      </section>

      {academies.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <h2 className="text-2xl font-black mb-6">Available Now</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {academies.map((academy) => {
              const styles = TRACK_STYLES[academy.code] ?? DEFAULT_STYLE;
              const totalLessonsInAcademy = academy.levels.reduce(
                (sum, l) => sum + l.lessonCount,
                0
              );
              const firstLevel = academy.levels.find((l) => l.lessonCount > 0);

              return (
                <Link
                  key={academy.code}
                  href={`/curriculum/${academy.code.toLowerCase()}`}
                  className={`rounded-2xl border p-6 transition group ${styles.bg} ${styles.border}`}
                >
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold mb-4 ${styles.badge}`}
                  >
                    {academy.code}
                  </span>
                  <h3
                    className={`text-2xl font-black transition group-hover:opacity-80 ${styles.heading}`}
                  >
                    {academy.name}
                  </h3>
                  {academy.description && (
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed line-clamp-3">
                      {academy.description}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-slate-400">
                    {totalLessonsInAcademy} lesson
                    {totalLessonsInAcademy !== 1 ? "s" : ""} ·{" "}
                    {academy.levels.length} level
                    {academy.levels.length !== 1 ? "s" : ""}
                  </p>
                  {firstLevel && firstLevel.lessonCount > 0 ? (
                    <p className="mt-2 text-xs text-slate-500">
                      Start with Level {firstLevel.level}: {firstLevel.lessonCount} lessons ready
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">
                      Track active · Lessons will appear here as they are published
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Fallback when there is no data at all (should not happen in production) */}
      {academies.length === 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-16 text-center">
            <p className="text-2xl font-bold text-slate-400">Curriculum Coming Soon</p>
            <p className="mt-3 text-slate-500">
              Production lessons are being prepared. Check back soon.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
