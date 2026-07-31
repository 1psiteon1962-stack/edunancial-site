import Link from "next/link";
import { notFound } from "next/navigation";

import { courses, lessons } from "@/lib/curriculum/production-catalog";
import { getAdminSession } from "@/lib/admin-content/auth";
import {
  getLessonContent,
  getLessonNavigation,
  getLessonsForLevel,
  getAllLessonStaticParams,
} from "@/lib/curriculum/reader";
import { renderMarkdown, extractToc, estimateReadingTime } from "@/lib/curriculum/markdown";
import LessonPageClient from "./LessonPageClient";

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export async function generateStaticParams() {
  // Derive static params from both the production catalog and the curriculum registry
  const catalogParams = Object.values(courses).flatMap((course) =>
    course.lessons.map((lessonId) => ({ courseId: course.id, lessonId }))
  );
  return catalogParams;
}

export async function generateMetadata({ params }: Props) {
  const { courseId, lessonId } = await params;
  const course = courses[courseId];
  const lesson = lessons[lessonId];
  if (!course || !lesson) return { title: "Lesson Not Found" };
  return { title: `${lesson.title} | ${course.title} | Edunancial` };
}

export default async function LessonPage({ params }: Props) {
  const { courseId, lessonId } = await params;
  const course = courses[courseId];
  const lesson = lessons[lessonId];
  if (!course || !lesson) notFound();

  const courseLessons = course.lessons.map((id) => lessons[id]).filter(Boolean);
  const currentIndex = courseLessons.findIndex((l) => l.id === lessonId);

  // Determine admin status server-side so admin can bypass all access restrictions.
  const session = await getAdminSession();
  const isAdmin = Boolean(session);

  // Access control: free courses are open to all; others require admin session or membership.
  const isCourseOpen = course.isFree ?? false;
  if (!isCourseOpen && !isAdmin) {
    return (
      <main className="min-h-screen bg-[#08101f] text-white flex flex-col items-center justify-center px-6">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="text-6xl">🔒</div>
          <h1 className="text-3xl font-black">Members Only</h1>
          <p className="text-slate-300 leading-relaxed">
            <strong className="text-white">{lesson.title}</strong> is part of{" "}
            <strong className="text-yellow-400">{course.title}</strong>. This course requires an active
            Edunancial membership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/membership"
              className="rounded-xl bg-yellow-500 px-8 py-4 font-black text-black hover:bg-yellow-400 transition"
            >
              View Membership Plans
            </Link>
            <Link
              href={`/courses/${courseId}`}
              className="rounded-xl border border-slate-600 px-8 py-4 font-bold text-slate-300 hover:bg-slate-800 transition"
            >
              Back to Course
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            Already a member?{" "}
            <Link href="/login" className="text-yellow-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    );
  }

  // Load markdown lesson content from the curriculum registry
  const content = getLessonContent(lessonId);
  const { prev: registryPrev, next: registryNext } = getLessonNavigation(lessonId);

  let renderedHtml: string | null = null;
  let toc: Array<{ id: string; text: string; level: 2 | 3 }> = [];
  let readingTime: number | null = null;
  let relatedLessons: Array<{ id: string; title: string; lessonNumber: number }> = [];

  if (content) {
    renderedHtml = renderMarkdown(content.body);
    toc = extractToc(content.body);
    readingTime = estimateReadingTime(content.body);

    // Siblings in the same track/level for "Related Lessons"
    const siblings = getLessonsForLevel(content.meta.track, content.meta.level);
    relatedLessons = siblings
      .filter((s) => s.id !== lessonId)
      .map((s) => ({ id: s.id, title: s.title, lessonNumber: s.lessonNumber }));
  }

  return (
    <LessonPageClient
      courseId={courseId}
      lessonId={lessonId}
      course={course}
      lesson={lesson}
      courseLessons={courseLessons}
      currentIndex={currentIndex}
      isAdmin={isAdmin}
      renderedHtml={renderedHtml}
      toc={toc}
      readingTime={readingTime}
      registryPrev={registryPrev ? { id: registryPrev.id, title: registryPrev.title } : null}
      registryNext={registryNext ? { id: registryNext.id, title: registryNext.title } : null}
      relatedLessons={relatedLessons}
    />
  );
}
