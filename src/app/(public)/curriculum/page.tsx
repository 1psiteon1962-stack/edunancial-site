import type { Metadata } from "next";
import Link from "next/link";

import { isPublicCurriculumTrack } from "@/lib/curriculum/localization";
import { listAcademies } from "@/lib/curriculum/reader";
import { getServerTranslator } from "@/lib/international/server";

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

export default async function CurriculumIndexPage() {
  const { language, t } = await getServerTranslator();
  const academies = listAcademies("free", language).filter((academy) =>
    isPublicCurriculumTrack(academy.code),
  );

  // A track is "Available Now" only when Level 1 has at least one published lesson.
  // This ensures the badge reflects actual live content at the entry level.
  const academiesWithLessons = academies.filter((a) => {
    const level1 = a.levels.find((l) => l.level === 1);
    return (level1?.lessonCount ?? 0) > 0;
  });
  // A track is "Coming Soon" when Level 1 has zero published lessons.
  const academiesComingSoon = academies.filter((a) => {
    const level1 = a.levels.find((l) => l.level === 1);
    return (level1?.lessonCount ?? 0) === 0;
  });

  const totalLessons = academies.reduce(
    (sum, a) => sum + a.levels.reduce((s, l) => s + l.lessonCount, 0),
    0
  );

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">{t("curriculumPage.label")}</p>
        <h1 className="mt-4 text-5xl font-black md:text-7xl leading-tight">
          {t("curriculumPage.title")}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
          {t("curriculumPage.intro")}
        </p>

        {totalLessons > 0 && (
          <p className="mt-4 text-sm text-slate-500">
            {t(
              totalLessons === 1
                ? "curriculumPage.publishedLessons_one"
                : "curriculumPage.publishedLessons_other",
              {
                lessonCount: totalLessons,
                academyCount: academiesWithLessons.length,
              },
            )}
          </p>
        )}
      </section>

      {/* Academies with published lessons */}
      {academiesWithLessons.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <h2 className="text-2xl font-black mb-6">{t("curriculumPage.availableNow")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {academiesWithLessons.map((academy) => {
              const styles = TRACK_STYLES[academy.code] ?? DEFAULT_STYLE;
              const totalLessonsInAcademy = academy.levels.reduce(
                (sum, l) => sum + l.lessonCount,
                0
              );
              const firstLevel = academy.levels.find((l) => l.lessonCount > 0);

              // Levels that have at least one published lesson
              const levelsWithContent = academy.levels.filter(
                (l) => l.lessonCount > 0
              ).length;

              return (
                <Link
                  key={academy.code}
                  href={`/curriculum/${academy.code.toLowerCase()}`}
                  className={`rounded-2xl border p-6 transition group ${styles.bg} ${styles.border}`}
                >
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${styles.badge}`}
                    >
                      {academy.code}
                    </span>
                    <span className="inline-block rounded-full px-3 py-1 text-xs font-bold bg-green-500/20 text-green-300 border border-green-500/40">
                      {t("curriculumPage.availableNow")}
                    </span>
                  </div>
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
                    {t(
                      totalLessonsInAcademy === 1
                        ? "curriculumPage.academyStats_one"
                        : "curriculumPage.academyStats_other",
                      {
                        lessonCount: totalLessonsInAcademy,
                        levelCount: levelsWithContent,
                      },
                    )}
                  </p>
                  {firstLevel && firstLevel.lessonCount > 0 && (
                    <p className="mt-2 text-xs text-slate-500">
                      {t(
                        firstLevel.lessonCount === 1
                          ? "curriculumPage.startLevel_one"
                          : "curriculumPage.startLevel_other",
                        {
                          level: firstLevel.level,
                          lessonCount: firstLevel.lessonCount,
                        },
                      )}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Academies coming soon */}
      {academiesComingSoon.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="text-xl font-black mb-4 text-slate-500">{t("curriculumPage.comingSoon")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {academiesComingSoon.map((academy) => {
              const styles = TRACK_STYLES[academy.code] ?? DEFAULT_STYLE;
              const publishedLessons = academy.levels.reduce(
                (sum, l) => sum + l.lessonCount,
                0
              );
              const levelsPlanned = academy.levels.length;
              return (
                <div
                  key={academy.code}
                  className={`rounded-2xl border p-5 opacity-60 ${styles.bg} ${styles.border}`}
                >
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${styles.badge}`}
                    >
                      {academy.code}
                    </span>
                    <span className="inline-block rounded-full px-2 py-0.5 text-xs font-bold bg-slate-600/30 text-slate-400 border border-slate-500/30">
                      {t("curriculumPage.comingSoon")}
                    </span>
                  </div>
                  <h3 className={`text-lg font-black ${styles.heading}`}>
                    {academy.name}
                  </h3>
                  {academy.description && (
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {academy.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-600">
                    {t(
                      publishedLessons === 1
                        ? "curriculumPage.plannedStats_one"
                        : "curriculumPage.plannedStats_other",
                      {
                        lessonCount: publishedLessons,
                        levelCount: levelsPlanned,
                      },
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Fallback when there is no data at all (should not happen in production) */}
      {academies.length === 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-16 text-center">
            <p className="text-2xl font-bold text-slate-400">{t("curriculumPage.emptyTitle")}</p>
            <p className="mt-3 text-slate-500">
              {t("curriculumPage.emptyBody")}
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
