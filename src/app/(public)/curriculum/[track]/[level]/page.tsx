import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { isPublicCurriculumTrack } from "@/lib/curriculum/localization";
import { getRuntimePublishedTrack } from "@/lib/curriculum/runtime-localization";
import { translate } from "@/lib/international/i18n";
import { getServerLanguage } from "@/lib/international/server";

interface Props { params: Promise<{ track: string; level: string }>; }
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track: trackParam, level: levelParam } = await params;
  const trackCode = trackParam.toUpperCase();
  const levelNum = Number(levelParam.replace(/^l/i, ""));
  const language = await getServerLanguage();
  const track = await getRuntimePublishedTrack(trackCode, language);
  if (!track) return { title: "Level Not Found | Edunancial" };
  const lessonCount = track.levels.find((entry) => entry.level === levelNum)?.lessonCount ?? 0;
  const title = `${track.name} — Level ${levelNum} | Edunancial`;
  const description = lessonCount > 0 ? `${track.code} Level ${levelNum}: Browse all ${lessonCount} lessons in this level.` : `${track.code} Level ${levelNum}: This level is active and lessons will be published soon.`;
  return { title, description, openGraph: { title, description, type: "website", siteName: "Edunancial" } };
}

const TRACK_COLORS: Record<string, { badge: string; heading: string; button: string }> = {
  RED: { badge: "text-red-400 border-red-500/40 bg-red-500/10", heading: "text-red-400", button: "bg-red-700 hover:bg-red-600" },
  WHITE: { badge: "text-slate-300 border-slate-500/40 bg-slate-500/10", heading: "text-slate-300", button: "bg-slate-700 hover:bg-slate-600" },
  BLUE: { badge: "text-blue-400 border-blue-500/40 bg-blue-500/10", heading: "text-blue-400", button: "bg-blue-700 hover:bg-blue-600" },
  GREEN: { badge: "text-green-400 border-green-500/40 bg-green-500/10", heading: "text-green-400", button: "bg-green-700 hover:bg-green-600" },
  GOLD: { badge: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10", heading: "text-yellow-400", button: "bg-yellow-600 hover:bg-yellow-500" },
  PURPLE: { badge: "text-purple-400 border-purple-500/40 bg-purple-500/10", heading: "text-purple-400", button: "bg-purple-700 hover:bg-purple-600" },
  ORANGE: { badge: "text-orange-400 border-orange-500/40 bg-orange-500/10", heading: "text-orange-400", button: "bg-orange-700 hover:bg-orange-600" },
  BLACK: { badge: "text-slate-200 border-slate-400/40 bg-slate-400/10", heading: "text-slate-200", button: "bg-slate-800 hover:bg-slate-700" },
};
const DEFAULT_COLORS = { badge: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10", heading: "text-yellow-400", button: "bg-yellow-600 hover:bg-yellow-500" };

export default async function LevelPage({ params }: Props) {
  const { track: trackParam, level: levelParam } = await params;
  const trackCode = trackParam.toUpperCase();
  const levelNum = Number(levelParam.replace(/^l/i, ""));
  const language = await getServerLanguage();
  if (!isPublicCurriculumTrack(trackCode)) notFound();
  const t = (key: string, values?: Record<string, string | number>) => translate(language, key, values);
  const track = await getRuntimePublishedTrack(trackCode, language);
  if (!track) notFound();
  const lessons = track.levels.find((entry) => entry.level === levelNum)?.lessons ?? [];
  const colors = TRACK_COLORS[trackCode] ?? DEFAULT_COLORS;

  return <main className="min-h-screen bg-[#08101f] text-white"><section className="mx-auto max-w-5xl px-6 py-16">
    <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8"><Link href="/curriculum" className="hover:text-white">{t("nav.curriculum")}</Link><span>/</span><Link href={`/curriculum/${trackParam}`} className="hover:text-white">{track.name}</Link><span>/</span><span className="text-slate-200">{t("curriculumTrack.levelLabel", { level: levelNum })}</span></nav>
    <div className="mb-10"><span className={`inline-block rounded-full px-3 py-1 text-xs font-bold border mb-4 ${colors.badge}`}>{t("curriculumLevel.badge", { code: trackCode, level: levelNum })}</span><h1 className={`text-4xl font-black md:text-5xl ${colors.heading}`}>{t("curriculumLevel.heading", { trackName: track.name, level: levelNum })}</h1><p className="mt-4 text-slate-300 text-lg">{lessons.length > 0 ? t(lessons.length === 1 ? "curriculumLevel.available_one" : "curriculumLevel.available_other", { count: lessons.length }) : t("curriculumLevel.emptySummary")}</p></div>
    {lessons.length > 0 ? <div className="space-y-3">{lessons.map((lesson, idx) => <Link key={lesson.id} href={`/curriculum/${trackParam}/${levelParam}/${lesson.id.toLowerCase()}`} className="flex items-start gap-5 rounded-2xl bg-slate-900 border border-slate-800 p-5 hover:border-slate-600 hover:bg-slate-800/70 transition group"><div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-black text-slate-400 group-hover:border-yellow-400 group-hover:text-yellow-400 transition">{idx + 1}</div><div className="flex-1 min-w-0"><p className="text-xs text-slate-500 mb-1">{lesson.id}</p><h3 className="font-bold text-white group-hover:text-yellow-400 transition leading-snug">{lesson.title}</h3>{lesson.summary && <p className="mt-1.5 text-sm text-slate-400 line-clamp-2 leading-relaxed">{lesson.summary}</p>}</div><span className="flex-shrink-0 text-slate-600 group-hover:text-yellow-400 transition text-lg">→</span></Link>)}</div> : <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center"><p className="text-2xl font-bold text-slate-200">{t("curriculumLevel.comingSoonTitle")}</p><p className="mt-3 text-slate-500">{t("curriculumLevel.comingSoonBody", { trackName: track.name, level: levelNum })}</p></div>}
    {lessons.length > 0 && <div className="mt-10"><Link href={`/curriculum/${trackParam}/${levelParam}/${lessons[0].id.toLowerCase()}`} className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white transition ${colors.button}`}>{t("curriculumLevel.startLesson")} →</Link></div>}
  </section></main>;
}
