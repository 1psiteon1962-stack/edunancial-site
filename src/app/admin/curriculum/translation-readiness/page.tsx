import type { Metadata } from "next";
import Link from "next/link";

import { requireAdminPageSession } from "@/lib/admin-content/auth";
import { getCurriculumTranslationReadiness } from "@/lib/curriculum/translation-readiness";

export const metadata: Metadata = {
  title: "L1 Translation Readiness | Edunancial Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TranslationReadinessPage() {
  await requireAdminPageSession();
  const report = await getCurriculumTranslationReadiness(1, 50);
  const completeTracks = report.tracks.filter((track) => track.allLanguagesComplete).length;

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">Curriculum Operations</p>
            <h1 className="mt-2 text-4xl font-black">Level 1 Translation Readiness</h1>
            <p className="mt-3 max-w-3xl text-slate-400">
              Completion requires 50 canonical lessons per academy and a translated lesson body for every supported curriculum locale. Translated menus, titles, or summaries alone do not count.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/curriculum" className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold hover:border-white">← Curriculum</Link>
            <Link href="/admin/content/upload" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold hover:bg-emerald-600">Upload Content</Link>
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <p className="text-xs uppercase tracking-wider text-slate-400">Academies Complete</p>
            <p className="mt-3 text-3xl font-black">{completeTracks} / {report.tracks.length}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <p className="text-xs uppercase tracking-wider text-slate-400">Required Lessons / Academy</p>
            <p className="mt-3 text-3xl font-black">{report.expectedLessonsPerTrack}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
            <p className="text-xs uppercase tracking-wider text-slate-400">Target Locales</p>
            <p className="mt-3 text-3xl font-black">{report.targetLocales.length}</p>
          </article>
        </section>

        <div className="mt-8 space-y-5">
          {report.tracks.map((track) => {
            const incompleteLocales = track.locales.filter((locale) => !locale.complete);
            return (
              <article key={track.track} className="rounded-2xl border border-white/10 bg-[#101a2f] p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-black">{track.track} · Level 1</h2>
                    <p className="mt-1 text-sm text-slate-400">Canonical lessons: {track.canonicalLessons} / {report.expectedLessonsPerTrack}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${track.allLanguagesComplete ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                    {track.allLanguagesComplete ? "COMPLETE" : "IN PROGRESS"}
                  </span>
                </div>

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="pb-3 pr-4">Locale</th>
                        <th className="pb-3 pr-4">Translated Bodies</th>
                        <th className="pb-3 pr-4">Missing</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {track.locales.map((locale) => (
                        <tr key={locale.locale}>
                          <td className="py-3 pr-4 font-bold">{locale.locale}</td>
                          <td className="py-3 pr-4">{locale.translatedBodies} / {locale.totalLessons}</td>
                          <td className="py-3 pr-4 text-slate-400">{locale.missingLessonIds.length}</td>
                          <td className="py-3">
                            <span className={locale.complete ? "font-bold text-emerald-400" : "font-bold text-amber-300"}>{locale.complete ? "Complete" : "Needs work"}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {incompleteLocales.length > 0 ? (
                  <details className="mt-5 rounded-xl bg-slate-950/30 p-4">
                    <summary className="cursor-pointer font-bold text-slate-300">Show missing lesson IDs</summary>
                    <div className="mt-4 space-y-3 text-xs text-slate-400">
                      {incompleteLocales.map((locale) => (
                        <p key={locale.locale}><span className="font-bold text-slate-200">{locale.locale}:</span> {locale.missingLessonIds.join(", ") || "Canonical lesson count is below 50."}</p>
                      ))}
                    </div>
                  </details>
                ) : null}
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-slate-500">Generated {new Date(report.generatedAt).toLocaleString()}</p>
      </section>
    </main>
  );
}
