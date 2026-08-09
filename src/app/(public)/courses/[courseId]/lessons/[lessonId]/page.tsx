import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAdminSession } from "@/lib/admin-content/auth";
import { getPublishedCourses, getPublishedLesson } from "@/lib/curriculum/authoritative-published";
import { renderMarkdown } from "@/lib/curriculum/markdown";
import { translate } from "@/lib/international/i18n";
import { normalizeLanguageCode } from "@/lib/international/languages";
import { LANGUAGE_COOKIE_NAME } from "@/lib/international/preferences";

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { courseId, lessonId } = await params;
  const cookieStore = await cookies();
  const language = normalizeLanguageCode(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value ?? "en-US");
  const courses = await getPublishedCourses(language);
  const course = courses.find((entry) => entry.id === courseId);
  const lesson = await getPublishedLesson(lessonId.toUpperCase(), language);
  if (!course || !lesson) return { title: "Lesson Not Found" };
  return { title: `${lesson.title} | ${course.title} | Edunancial` };
}

export default async function LessonPage({ params }: Props) {
  const { courseId, lessonId } = await params;
  const cookieStore = await cookies();
  const language = normalizeLanguageCode(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value ?? "en-US");
  const t = (key: string, values?: Record<string, string | number>) => translate(language, key, values);

  const courses = await getPublishedCourses(language);
  const course = courses.find((entry) => entry.id === courseId);
  if (!course) notFound();

  const lesson = await getPublishedLesson(lessonId.toUpperCase(), language);
  if (!lesson || !course.lessons.some((entry) => entry.id === lesson.id)) notFound();

  const courseLessons = course.lessons;
  const currentIndex = courseLessons.findIndex((entry) => entry.id === lesson.id);
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;

  const session = await getAdminSession();
  const isAdmin = Boolean(session);
  const isCourseOpen = true;
  if (!isCourseOpen && !isAdmin) {
    return (
      <main className="min-h-screen bg-[#08101f] text-white flex flex-col items-center justify-center px-6">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="text-6xl">🔒</div>
          <h1 className="text-3xl font-black">{t("curriculumLesson.membersOnly")}</h1>
          <p className="text-slate-300 leading-relaxed">
            <strong className="text-white">{lesson.title}</strong> is part of <strong className="text-yellow-400">{course.title}</strong>. {t("courseLesson.membershipRequired")}
          </p>
          <Link href="/membership" className="rounded-xl bg-yellow-500 px-8 py-4 font-black text-black hover:bg-yellow-400 transition">{t("courseLesson.viewMembershipPlans")}</Link>
        </div>
      </main>
    );
  }

  const html = renderMarkdown(lesson.body);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-14">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/courses" className="hover:text-white">{t("courses.label")}</Link>
          <span>/</span>
          <Link href={`/courses/${courseId}`} className="hover:text-white">{course.title}</Link>
          <span>/</span>
          <span className="text-slate-200">{lesson.title}</span>
        </nav>

        <h1 className="text-4xl font-black md:text-5xl">{lesson.title}</h1>
        {lesson.summary ? <p className="mt-4 text-lg text-slate-300">{lesson.summary}</p> : null}

        <article className="prose prose-invert max-w-none mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-8" dangerouslySetInnerHTML={{ __html: html }} />

        <div className="mt-10 flex flex-wrap justify-between gap-3">
          {prevLesson ? (
            <Link href={`/courses/${courseId}/lessons/${prevLesson.id.toLowerCase()}`} className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-200 hover:bg-slate-800">← {prevLesson.title}</Link>
          ) : <span />}
          {nextLesson ? (
            <Link href={`/courses/${courseId}/lessons/${nextLesson.id.toLowerCase()}`} className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-200 hover:bg-slate-800">{nextLesson.title} →</Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
