import Link from "next/link";
import { notFound } from "next/navigation";

import LessonAccessGate from "./LessonAccessGate";
import { getAdminSession } from "@/lib/admin-content/auth";
import { getPublishedCourses, getPublishedLesson } from "@/lib/curriculum/authoritative-published";
import { renderMarkdown } from "@/lib/curriculum/markdown";
import { translate } from "@/lib/international/i18n";
import { getServerLanguage } from "@/lib/international/server";

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { courseId, lessonId } = await params;
  const language = await getServerLanguage();
  const courses = await getPublishedCourses(language);
  const course = courses.find((entry) => entry.id === courseId);
  const lesson = await getPublishedLesson(lessonId.toUpperCase(), language);
  if (!course || !lesson) return { title: "Lesson Not Found" };
  return { title: `${lesson.title} | ${course.title} | Edunancial` };
}

export default async function LessonPage({ params }: Props) {
  const { courseId, lessonId } = await params;
  const language = await getServerLanguage();
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
  const html = renderMarkdown(lesson.body);

  return (
    <LessonAccessGate
      level={lesson.level}
      lessonNumber={lesson.lessonNumber}
      isAdmin={isAdmin}
      lessonTitle={lesson.title}
      courseTitle={course.title}
      membersOnlyLabel={t("curriculumLesson.membersOnly")}
      membershipRequiredLabel={t("courseLesson.membershipRequired")}
      viewMembershipPlansLabel={t("courseLesson.viewMembershipPlans")}
    >
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
    </LessonAccessGate>
  );
}
