import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { isPublicCurriculumTrack } from "@/lib/curriculum/localization";
import {
  getAllLessonStaticParams,
  getLessonContent,
  getPlaceholderLessonMeta,
  getLessonNavigation,
  getLessonsForLevel,
} from "@/lib/curriculum/reader";
import { renderMarkdown } from "@/lib/curriculum/markdown";
import { checkLessonAccess } from "@/lib/curriculum/access-gate";
import LessonVideoPlayer from "@/components/curriculum/LessonVideoPlayer";
import { translate } from "@/lib/international/i18n";
import { normalizeLanguageCode } from "@/lib/international/languages";
import { LANGUAGE_COOKIE_NAME } from "@/lib/international/preferences";

interface Props {
  params: Promise<{ track: string; level: string; lesson: string }>;
}

export async function generateStaticParams() {
  return getAllLessonStaticParams().filter((params) =>
    isPublicCurriculumTrack(params.track.toUpperCase()),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track: trackParam, level: levelParam, lesson: lessonParam } = await params;
  const lessonId = lessonParam.toUpperCase();
  const trackCode = trackParam.toUpperCase();
  const levelNum = Number(levelParam.replace(/^l/i, ""));
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") ?? "";
  const languageMatch = cookieHeader.match(/(?:^|;\s*)edunancial-lang=([^;]+)/u);
  const language = normalizeLanguageCode(languageMatch?.[1] ? decodeURIComponent(languageMatch[1]) : "en-US");
  const content = getLessonContent(lessonId, language);
  if (!content) {
    const placeholder = getPlaceholderLessonMeta(trackCode, lessonId, levelNum, language);
    if (!placeholder) return { title: "Lesson Not Found | Edunancial" };

    return {
      title: `${placeholder.id} | Lesson Coming Soon | Edunancial`,
      description: `${placeholder.trackName} Level ${placeholder.level} Lesson ${placeholder.lessonNumber} is part of an active track and will be published soon.`,
      openGraph: {
        title: `${placeholder.id} | Lesson Coming Soon | Edunancial`,
        description: `${placeholder.trackName} Level ${placeholder.level} Lesson ${placeholder.lessonNumber} is part of an active track and will be published soon.`,
        type: "website",
        siteName: "Edunancial",
      },
    };
  }

  const { meta } = content;
  const title = `${meta.id} — ${meta.title} | Edunancial`;
  const description = meta.summary || `${meta.trackName} Level ${meta.level} — Lesson ${meta.lessonNumber}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Edunancial",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
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
  const cookieHeader = headersList.get("cookie") ?? "";
  const languageMatch = cookieHeader.match(/(?:^|;\s*)edunancial-lang=([^;]+)/u);
  const language = normalizeLanguageCode(languageMatch?.[1] ? decodeURIComponent(languageMatch[1]) : "en-US");
  const t = (key: string, values?: Record<string, string | number>) => translate(language, key, values);

  const content = getLessonContent(lessonId, language);
  if (!content) {
    const placeholder = getPlaceholderLessonMeta(trackCode, lessonId, levelNum, language);
    if (!placeholder) notFound();

    const siblings = getLessonsForLevel(trackCode, levelNum, "free", language);

    return (
      <main className="min-h-screen bg-[#08101f] text-white">
        <section className="mx-auto max-w-4xl px-6 py-16">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <Link href="/curriculum" className="hover:text-white">{t("nav.curriculum")}</Link>
            <span>/</span>
            <Link href={`/curriculum/${trackParam}`} className="hover:text-white">{placeholder.trackName}</Link>
            <span>/</span>
            <Link href={`/curriculum/${trackParam}/${levelParam}`} className="hover:text-white">{t("curriculumTrack.levelLabel", { level: levelNum })}</Link>
            <span>/</span>
            <span className="text-slate-200">{placeholder.id}</span>
          </nav>

          <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 md:p-12">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold border ${TRACK_COLORS[trackCode] ?? "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"}`}>
              {t("curriculumLevel.badge", { code: trackCode, level: levelNum })}
            </span>
            <h1 className="mt-6 text-4xl font-black md:text-5xl">{t("curriculumLesson.comingSoonTitle")}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              {t("curriculumLesson.comingSoonBody", {
                trackName: placeholder.trackName,
                level: placeholder.level,
                lessonNumber: placeholder.lessonNumber,
              })}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/curriculum/${trackParam}/${levelParam}`}
                className="rounded-xl bg-yellow-500 px-6 py-3 text-center font-black text-black hover:bg-yellow-400 transition"
              >
                {t("curriculumLesson.returnToLevel", { level: levelNum })}
              </Link>
              <Link
                href={`/curriculum/${trackParam}`}
                className="rounded-xl border border-slate-700 px-6 py-3 text-center font-bold text-slate-300 hover:bg-slate-800 transition"
              >
                {t("curriculumLesson.viewTrack", { trackName: placeholder.trackName })}
              </Link>
            </div>

            {siblings.length > 0 && (
              <p className="mt-6 text-sm text-slate-500">
                {t(
                  siblings.length === 1
                    ? "curriculumLesson.publishedInLevel_one"
                    : "curriculumLesson.publishedInLevel_other",
                  { count: siblings.length },
                )}
              </p>
            )}
          </div>
        </section>
      </main>
    );
  }

  const { meta, body, videos } = content;
  const { prev, next } = getLessonNavigation(lessonId);
  const siblings = getLessonsForLevel(trackCode, levelNum, "free", language);

  const trackColor = TRACK_COLORS[trackCode] ?? "text-yellow-400 border-yellow-500/40 bg-yellow-500/10";

  // ── Server-side access gate ───────────────────────────────────────────────
  const access = checkLessonAccess(meta.level, meta.lessonNumber, cookieHeader);

  if (!access.allowed) {
    // Render locked lesson view — body content is never passed to the client
    const pricingHref = access.pricingTierParam
      ? `/pricing?tier=${access.pricingTierParam}`
      : "/pricing";

    return (
      <main className="min-h-screen bg-[#08101f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800">
                <Link
                  href={`/curriculum/${trackParam}/${levelParam}`}
                  className="text-xs text-yellow-400 hover:text-yellow-300"
                >
                  ← {t("curriculumLesson.backToLevel", { level: levelNum })}
                </Link>
                <p className="mt-2 font-black text-sm">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs border mr-2 ${trackColor}`}>
                    {trackCode}
                  </span>
                  Level {levelNum}
                </p>
                <p className="text-xs text-slate-400 mt-1">{t(
                  siblings.length === 1 ? "curriculumLevel.available_one" : "curriculumLevel.available_other",
                  { count: siblings.length },
                )}</p>
              </div>
              <div className="divide-y divide-slate-800 max-h-[60vh] overflow-y-auto">
                {siblings.map((l) => (
                  <Link
                    key={l.id}
                    href={`/curriculum/${trackParam}/${levelParam}/${l.id.toLowerCase()}`}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition ${
                      l.id === meta.id ? "bg-slate-800 border-l-2 border-yellow-400" : ""
                    }`}
                  >
                    <span className="text-xs w-6 text-center text-slate-400 flex-shrink-0">
                      {l.lessonNumber}
                    </span>
                    <span
                      className={`text-sm flex-1 leading-tight ${
                        l.id === meta.id ? "text-yellow-400 font-bold" : "text-slate-300"
                      }`}
                    >
                      {l.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Locked lesson */}
          <div className="lg:col-span-3 space-y-6">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <Link href="/curriculum" className="hover:text-white">{t("nav.curriculum")}</Link>
              <span>/</span>
              <Link href={`/curriculum/${trackParam}`} className="hover:text-white">{meta.trackName}</Link>
              <span>/</span>
              <Link href={`/curriculum/${trackParam}/${levelParam}`} className="hover:text-white">{t("curriculumTrack.levelLabel", { level: levelNum })}</Link>
              <span>/</span>
              <span className="text-slate-200 truncate max-w-[200px]">{meta.title}</span>
            </nav>

            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold border ${trackColor}`}>
                  {t("curriculumLevel.badge", { code: trackCode, level: levelNum })}
                </span>
                <span className="text-xs text-slate-500">{t("curriculumLesson.position", { lessonNumber: meta.lessonNumber, total: siblings.length })}</span>
              </div>
              <h1 className="text-3xl font-black md:text-4xl leading-tight">{meta.title}</h1>
              {meta.summary && (
                <p className="mt-3 text-slate-300 leading-relaxed max-w-3xl">{meta.summary}</p>
              )}
            </div>

            {/* Locked content gate */}
            <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/5 p-8 text-center space-y-4">
              <div className="text-4xl">🔒</div>
              <h2 className="text-xl font-black text-yellow-400">{t("curriculumLesson.membersOnly")}</h2>
              <p className="text-slate-300 max-w-lg mx-auto leading-relaxed">
                {access.lockedMessage}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href={pricingHref}
                  className="rounded-xl bg-yellow-500 px-6 py-3 text-sm font-black text-black hover:bg-yellow-400 transition"
                >
                  {t("curriculumLesson.becomeMember")} →
                </Link>
                <Link
                  href="/curriculum"
                  className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-500 transition"
                >
                  {t("curriculumLesson.browseFreeLessons")}
                </Link>
              </div>
              <p className="text-xs text-slate-500 pt-2">
                {t("curriculumLesson.freePreviewNote")}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Full lesson view (access granted) ────────────────────────────────────
  const renderedBody = renderMarkdown(body);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 grid gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <Link
                href={`/curriculum/${trackParam}/${levelParam}`}
                className="text-xs text-yellow-400 hover:text-yellow-300"
              >
                ← {t("curriculumLesson.backToLevel", { level: levelNum })}
              </Link>
              <p className="mt-2 font-black text-sm">
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs border mr-2 ${trackColor}`}>
                  {trackCode}
                </span>
                Level {levelNum}
              </p>
              <p className="text-xs text-slate-400 mt-1">{t(
                siblings.length === 1 ? "curriculumLevel.available_one" : "curriculumLevel.available_other",
                { count: siblings.length },
              )}</p>
            </div>
            <div className="divide-y divide-slate-800 max-h-[60vh] overflow-y-auto">
              {siblings.map((l) => (
                <Link
                  key={l.id}
                  href={`/curriculum/${trackParam}/${levelParam}/${l.id.toLowerCase()}`}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition ${
                    l.id === meta.id ? "bg-slate-800 border-l-2 border-yellow-400" : ""
                  }`}
                >
                  <span className="text-xs w-6 text-center text-slate-400 flex-shrink-0">
                    {l.lessonNumber}
                  </span>
                  <span
                    className={`text-sm flex-1 leading-tight ${
                      l.id === meta.id ? "text-yellow-400 font-bold" : "text-slate-300"
                    }`}
                  >
                    {l.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <Link href="/curriculum" className="hover:text-white">
              {t("nav.curriculum")}
            </Link>
            <span>/</span>
            <Link href={`/curriculum/${trackParam}`} className="hover:text-white">
              {meta.trackName}
            </Link>
            <span>/</span>
            <Link href={`/curriculum/${trackParam}/${levelParam}`} className="hover:text-white">
              Level {levelNum}
            </Link>
            <span>/</span>
            <span className="text-slate-200 truncate max-w-[200px]">{meta.title}</span>
          </nav>

          {/* Lesson header */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-bold border ${trackColor}`}
              >
                {t("curriculumLevel.badge", { code: trackCode, level: levelNum })}
              </span>
              <span className="text-xs text-slate-500">{t("curriculumLesson.position", { lessonNumber: meta.lessonNumber, total: siblings.length })}</span>
              <span className="text-xs text-slate-500">{meta.id}</span>
            </div>
            <h1 className="text-3xl font-black md:text-4xl leading-tight">{meta.title}</h1>
            {meta.summary && (
              <p className="mt-3 text-slate-300 leading-relaxed max-w-3xl">{meta.summary}</p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              {meta.author} · {meta.date} · Version {meta.version}
            </p>
          </div>

          {/* Lesson Videos */}
          {videos.length > 0 && (
            <section aria-label={t("curriculumLesson.videosLabel")}>
          <h2 className="text-xl font-black text-white mb-4">{t("curriculumLesson.videosLabel")}</h2>
              {videos.map((video) => (
                <LessonVideoPlayer key={video.id} video={video} />
              ))}
            </section>
          )}

          {/* Lesson content */}
          <article
            className="prose-curriculum rounded-2xl bg-slate-900/50 border border-slate-800 p-6 md:p-8"
            dangerouslySetInnerHTML={{ __html: renderedBody }}
          />

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 pt-4">
            {prev ? (
              <Link
                href={`/curriculum/${trackParam}/${levelParam}/${prev.id.toLowerCase()}`}
                className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-5 py-3 text-sm font-bold hover:bg-slate-800 transition max-w-[45%]"
              >
                <span className="flex-shrink-0">←</span>
                <span className="truncate hidden sm:inline">{prev.title}</span>
                <span className="sm:hidden">{t("curriculumLesson.previous")}</span>
              </Link>
            ) : (
              <div />
            )}

            <Link
              href={`/curriculum/${trackParam}/${levelParam}`}
              className="text-sm text-slate-400 hover:text-white flex-shrink-0"
            >
              {t("curriculumTrack.levelLabel", { level: levelNum })}
            </Link>

            {next ? (
              <Link
                href={`/curriculum/${trackParam}/${levelParam}/${next.id.toLowerCase()}`}
                className="flex items-center gap-2 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-black text-black hover:bg-yellow-400 transition max-w-[45%]"
              >
                <span className="truncate hidden sm:inline">{next.title}</span>
                <span className="sm:hidden">{t("curriculumLesson.next")}</span>
                <span className="flex-shrink-0">→</span>
              </Link>
            ) : (
              <Link
                href={`/curriculum/${trackParam}`}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white hover:bg-green-500 transition"
              >
                ✅ {t("curriculumLesson.levelComplete")}
              </Link>
            )}
          </div>

          {/* Mobile lesson list */}
          <div className="lg:hidden">
            <details className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <summary className="px-5 py-4 cursor-pointer text-sm font-bold text-slate-300 hover:text-white">
                {t("curriculumLesson.allLessons", { count: siblings.length })}
              </summary>
              <div className="divide-y divide-slate-800 max-h-64 overflow-y-auto border-t border-slate-800">
                {siblings.map((l) => (
                  <Link
                    key={l.id}
                    href={`/curriculum/${trackParam}/${levelParam}/${l.id.toLowerCase()}`}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition ${
                      l.id === meta.id ? "bg-slate-800 border-l-2 border-yellow-400" : ""
                    }`}
                  >
                    <span className="text-xs w-6 text-center text-slate-400">{l.lessonNumber}</span>
                    <span
                      className={`text-sm flex-1 leading-tight ${
                        l.id === meta.id ? "text-yellow-400 font-bold" : "text-slate-300"
                      }`}
                    >
                      {l.title}
                    </span>
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}
