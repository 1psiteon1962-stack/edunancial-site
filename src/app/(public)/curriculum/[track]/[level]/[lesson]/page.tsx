import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { checkLessonAccess } from "@/lib/curriculum/access-gate";
import { isPublicCurriculumTrack } from "@/lib/curriculum/localization";
import { renderMarkdown } from "@/lib/curriculum/markdown";
import {
  getRuntimePublishedLesson,
  getRuntimePublishedTrack,
} from "@/lib/curriculum/runtime-localization";
import { translate } from "@/lib/international/i18n";
import { resolveRequestLanguage } from "@/lib/international/server";

interface Props {
  params: Promise<{ track: string; level: string; lesson: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lesson: lessonParam } = await params;
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");
  const language = resolveRequestLanguage({
    cookieHeader,
    acceptLanguageHeader: headersList.get("accept-language"),
  });
  const lesson = await getRuntimePublishedLesson(lessonParam.toUpperCase(), language);
  if (!lesson) return { title: "Lesson Not Found | Edunancial" };

  const title = `${lesson.id} — ${lesson.title} | Edunancial`;
  const description = lesson.summary || `${lesson.trackName} Level ${lesson.level} — Lesson ${lesson.lessonNumber}`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article", siteName: "Edunancial" },
    twitter: { card: "summary", title, description },
  };
}

const TRACK_COLORS: Record<string, string> = {
  RED: "text-red-400 border-red-500/40 bg-red-500/10",
  WHITE: "text-slate-300 border-slate-500/40 bg-slate-500/10",
  BLUE: "text-blue-400 border-blue-500/40 bg-blue-500/10",
  GREEN: "text-green-400 border-green-500/40 bg-green-500/10",
  GOLD: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
  PURPLE: "text-purple-400 border-purple-500/40 bg-purple-500/10",
  ORANGE: "text-orange-400 border-orange-500/40 bg-orange-500/10",
  BLACK: "text-slate-200 border-slate-400/40 bg-slate-400/10",
};

export default async function LessonViewerPage({ params }: Props) {
  const { track: trackParam, level: levelParam, lesson: lessonParam } = await params;
  const lessonId = lessonParam.toUpperCase();
  const trackCode = trackParam.toUpperCase();
  const levelNum = Number(levelParam.replace(/^l/i, ""));
  if (!isPublicCurriculumTrack(trackCode)) notFound();

  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");
  const language = resolveRequestLanguage({
    cookieHeader,
    acceptLanguageHeader: headersList.get("accept-language"),
  });
  const t = (key: string, values?: Record<string, string | number>) => translate(language, key, values);

  const lesson = await getRuntimePublishedLesson(lessonId, language);
  if (!lesson) notFound();

  const track = await getRuntimePublishedTrack(trackCode, language);
  if (!track) notFound();

  const level = track.levels.find((entry) => entry.level === levelNum);
  if (!level) notFound();

  const siblings = level.lessons;
  const currentIndex = siblings.findIndex((entry) => entry.id === lesson.id);
  const prev = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  const trackColor = TRACK_COLORS[trackCode] ?? "text-yellow-400 border-yellow-500/40 bg-yellow-500/10";
  const access = checkLessonAccess(lesson.level, lesson.lessonNumber, cookieHeader, lesson.id, language);

  if (!access.allowed) {
    const pricingHref = access.pricingTierParam ? `/pricing?tier=${access.pricingTierParam}` : "/pricing";

    return (
      <main className="min-h-screen bg-[#08101f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 grid gap-8 lg:grid-cols-4">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800">
                <Link href={`/curriculum/${trackParam}/${levelParam}`} className="text-xs text-yellow-400 hover:text-yellow-300">
                  ← {t("curriculumLesson.backToLevel", { level: levelNum })}
                </Link>
                <p className="mt-2 font-black text-sm">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs border mr-2 ${trackColor}`}>{trackCode}</span>
                  {t("curriculumTrack.levelLabel", { level: levelNum })}
                </p>
              </div>
              <div className="divide-y divide-slate-800 max-h-[60vh] overflow-y-auto">
                {siblings.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/curriculum/${trackParam}/${levelParam}/${entry.id.toLowerCase()}`}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition ${entry.id === lesson.id ? "bg-slate-800 border-l-2 border-yellow-400" : ""}`}
                  >
                    <span className="text-xs w-6 text-center text-slate-400 flex-shrink-0">{entry.lessonNumber}</span>
                    <span className={`text-sm flex-1 leading-tight ${entry.id === lesson.id ? "text-yellow-400 font-bold" : "text-slate-300"}`}>{entry.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <Link href="/curriculum" className="hover:text-white">{t("nav.curriculum")}</Link>
              <span>/</span>
              <Link href={`/curriculum/${trackParam}`} className="hover:text-white">{track.name}</Link>
              <span>/</span>
              <Link href={`/curriculum/${trackParam}/${levelParam}`} className="hover:text-white">{t("curriculumTrack.levelLabel", { level: levelNum })}</Link>
              <span>/</span>
              <span className="text-slate-200 truncate max-w-[200px]">{lesson.title}</span>
            </nav>

            <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/5 p-8 text-center space-y-4">
              <div className="text-4xl">🔒</div>
              <h2 className="text-xl font-black text-yellow-400">{t("curriculumLesson.membersOnly")}</h2>
              <p className="text-slate-300 max-w-lg mx-auto leading-relaxed">{access.lockedMessage}</p>
              <Link href={pricingHref} className="inline-block rounded-xl bg-yellow-500 px-6 py-3 font-black text-black hover:bg-yellow-400 transition">
                {t("curriculumLesson.unlockCurriculum")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const html = renderMarkdown(lesson.body);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-4xl px-6 py-14">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/curriculum" className="hover:text-white">{t("nav.curriculum")}</Link>
          <span>/</span>
          <Link href={`/curriculum/${trackParam}`} className="hover:text-white">{track.name}</Link>
          <span>/</span>
          <Link href={`/curriculum/${trackParam}/${levelParam}`} className="hover:text-white">{t("curriculumTrack.levelLabel", { level: levelNum })}</Link>
          <span>/</span>
          <span className="text-slate-200">{lesson.id}</span>
        </nav>

        <div className="mt-8">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold border ${trackColor}`}>
            {t("curriculumLevel.badge", { code: trackCode, level: levelNum })}
          </span>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">{lesson.title}</h1>
          {lesson.summary ? <p className="mt-4 text-lg text-slate-300">{lesson.summary}</p> : null}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-10">
          <article className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-3">
          {prev ? (
            <Link href={`/curriculum/${trackParam}/${levelParam}/${prev.id.toLowerCase()}`} className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-200 hover:bg-slate-800">← {prev.title}</Link>
          ) : <span />}
          {next ? (
            <Link href={`/curriculum/${trackParam}/${levelParam}/${next.id.toLowerCase()}`} className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-200 hover:bg-slate-800">{next.title} →</Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
