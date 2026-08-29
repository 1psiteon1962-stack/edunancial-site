import type { Metadata } from "next";
import Link from "next/link";

import { requireAdminPageSession } from "@/lib/admin-content/auth";
import { getCurriculumTranslationReadiness } from "@/lib/curriculum/translation-readiness";

export const metadata: Metadata = {
  title: "Translation Readiness | Edunancial Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const LEVELS = [1, 2, 3, 4, 5] as const;
const EXPECTED_LESSONS_PER_LEVEL = 50;
const NORTH_AMERICA_TRANSLATION_LOCALES = ["es-Caribbean", "fr-CA"] as const;

export default async function TranslationReadinessPage() {
  await requireAdminPageSession();
  const [reports, northAmericaReports] = await Promise.all([
    Promise.all(LEVELS.map((level) => getCurriculumTranslationReadiness(level, EXPECTED_LESSONS_PER_LEVEL))),
    Promise.all(LEVELS.map((level) => getCurriculumTranslationReadiness(level, EXPECTED_LESSONS_PER_LEVEL, NORTH_AMERICA_TRANSLATION_LOCALES))),
  ]);
  const totalTrackLevels = reports.reduce((sum, report) => sum + report.tracks.length, 0);
  const completeTrackLevels = reports.reduce((sum, report) => sum + report.tracks.filter((track) => track.allLanguagesComplete).length, 0);
  const targetLocales = reports[0]?.targetLocales ?? [];
  const northAmericaTotalTrackLevels = northAmericaReports.reduce((sum, report) => sum + report.tracks.length, 0);
  const northAmericaCompleteTrackLevels = northAmericaReports.reduce((sum, report) => sum + report.tracks.filter((track) => track.allLanguagesComplete).length, 0);
  const northAmericaReady = northAmericaTotalTrackLevels > 0 && northAmericaCompleteTrackLevels === northAmericaTotalTrackLevels;

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">Curriculum Operations</p>
            <h1 className="mt-2 text-4xl font-black">Translation Readiness · Levels 1–5</h1>
            <p className="mt-3 max-w-3xl text-slate-400">Tracks every academy, level, and supported curriculum locale. A translation counts only when the lesson body is actually localized; translated menus, titles, summaries, or English fallback do not count.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/curriculum" className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold hover:border-white">← Curriculum</Link>
            <Link href="/admin/content/bulk" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold hover:bg-emerald-600">Bulk Upload Content</Link>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-blue-400/20 bg-blue-500/5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">North America Launch Gate</p>
              <h2 className="mt-2 text-2xl font-black">United States + Canada curriculum translation readiness</h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-400">Canonical English is measured from the published curriculum. The regional translation gate separately verifies Caribbean Spanish and Canadian French lesson bodies across every academy and Levels 1–5, without requiring future Europe or Latin America locales to be complete first.</p>
            </div>
            <span className={`rounded-full px-4 py-2 text-sm font-black ${northAmericaReady ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>{northAmericaReady ? "READY" : "IN PROGRESS"}</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-950/30 p-4"><p className="text-xs text-slate-400">Track-Levels Complete</p><p className="mt-2 text-2xl font-black">{northAmericaCompleteTrackLevels} / {northAmericaTotalTrackLevels}</p></div>
            <div className="rounded-xl bg-slate-950/30 p-4"><p className="text-xs text-slate-400">Translation Locales</p><p className="mt-2 text-lg font-black">{northAmericaReports[0]?.targetLocales.join(" · ") || "None"}</p></div>
            <div className="rounded-xl bg-slate-950/30 p-4"><p className="text-xs text-slate-400">English Curriculum</p><p className="mt-2 text-lg font-black">Canonical</p></div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-4">
          <article className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"><p className="text-xs uppercase tracking-wider text-slate-400">Global Track-Levels Complete</p><p className="mt-3 text-3xl font-black">{completeTrackLevels} / {totalTrackLevels}</p></article>
          <article className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"><p className="text-xs uppercase tracking-wider text-slate-400">Levels Tracked</p><p className="mt-3 text-3xl font-black">{LEVELS.length}</p></article>
          <article className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"><p className="text-xs uppercase tracking-wider text-slate-400">Expected Lessons / Level</p><p className="mt-3 text-3xl font-black">{EXPECTED_LESSONS_PER_LEVEL}</p></article>
          <article className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"><p className="text-xs uppercase tracking-wider text-slate-400">Global Target Locales</p><p className="mt-3 text-3xl font-black">{targetLocales.length}</p></article>
        </section>

        <div className="mt-8 space-y-8">
          {reports.map((report) => {
            const completeTracks = report.tracks.filter((track) => track.allLanguagesComplete).length;
            return (
              <section key={report.level} className="rounded-2xl border border-white/10 bg-slate-950/20 p-5">
                <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">Level {report.level}</p><h2 className="mt-1 text-2xl font-black">{completeTracks} / {report.tracks.length} academies complete</h2></div><p className="text-sm text-slate-400">Expected: {report.expectedLessonsPerTrack} canonical lessons per academy</p></div>
                <div className="mt-5 space-y-5">
                  {report.tracks.map((track) => {
                    const incompleteLocales = track.locales.filter((locale) => !locale.complete);
                    return (
                      <article key={`${report.level}-${track.track}`} className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-black">{track.track} · Level {report.level}</h3><p className="mt-1 text-sm text-slate-400">Canonical lessons: {track.canonicalLessons} / {report.expectedLessonsPerTrack}</p></div><span className={`rounded-full px-3 py-1 text-xs font-black ${track.allLanguagesComplete ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>{track.allLanguagesComplete ? "COMPLETE" : "IN PROGRESS"}</span></div>
                        <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="text-xs uppercase tracking-wider text-slate-500"><tr><th className="pb-3 pr-4">Locale</th><th className="pb-3 pr-4">Translated Bodies</th><th className="pb-3 pr-4">Missing</th><th className="pb-3">Status</th></tr></thead><tbody className="divide-y divide-white/5">{track.locales.map((locale) => (<tr key={locale.locale}><td className="py-3 pr-4 font-bold">{locale.locale}</td><td className="py-3 pr-4">{locale.translatedBodies} / {locale.totalLessons}</td><td className="py-3 pr-4 text-slate-400">{locale.missingLessonIds.length}</td><td className="py-3"><span className={locale.complete ? "font-bold text-emerald-400" : "font-bold text-amber-300"}>{locale.complete ? "Complete" : "Needs work"}</span></td></tr>))}</tbody></table></div>
                        {incompleteLocales.length > 0 ? (<details className="mt-5 rounded-xl bg-slate-950/30 p-4"><summary className="cursor-pointer font-bold text-slate-300">Show missing lesson IDs</summary><div className="mt-4 space-y-3 text-xs text-slate-400">{incompleteLocales.map((locale) => (<p key={locale.locale}><span className="font-bold text-slate-200">{locale.locale}:</span> {locale.missingLessonIds.join(", ") || `Canonical Level ${report.level} lesson count is below ${report.expectedLessonsPerTrack}.`}</p>))}</div></details>) : null}
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
        <p className="mt-8 text-xs text-slate-500">Generated {new Date(reports[0]?.generatedAt ?? Date.now()).toLocaleString()}</p>
      </section>
    </main>
  );
}
