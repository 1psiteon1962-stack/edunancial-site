import Link from "next/link";
import { notFound } from "next/navigation";

import { courses, lessons } from "@/lib/curriculum/production-catalog";
import { getPlaceholderLessonMeta } from "@/lib/curriculum/reader";
import { getAdminSession } from "@/lib/admin-content/auth";
import LessonPageClient from "./LessonPageClient";

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { courseId, lessonId } = await params;
  const course = courses[courseId];
  const lesson = lessons[lessonId];
  if (!course) return { title: "Lesson Not Found" };
  if (!lesson) {
    const placeholder = getPlaceholderLessonMeta(courseId, lessonId);
    if (!placeholder) return { title: "Lesson Not Found" };
    return { title: `${placeholder.id} | Lesson Coming Soon | ${course.title} | Edunancial` };
  }
  return { title: `${lesson.title} | ${course.title} | Edunancial` };
}

export default async function LessonPage({ params }: Props) {
  const { courseId, lessonId } = await params;
  const course = courses[courseId];
  const lesson = lessons[lessonId];
  if (!course) notFound();
  if (!lesson) {
    const placeholder = getPlaceholderLessonMeta(courseId, lessonId);
    if (!placeholder) notFound();

    return (
      <main className="min-h-screen bg-[#08101f] text-white flex items-center px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/60 p-8 md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.4em] text-yellow-400">{course.title}</p>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">Lesson coming soon</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            {placeholder.trackName} Level {placeholder.level} Lesson {placeholder.lessonNumber} belongs to an active curriculum track.
            The lesson content has not been published yet, but the track remains available now.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/courses/${courseId}`}
              className="rounded-xl bg-yellow-500 px-6 py-3 text-center font-black text-black hover:bg-yellow-400 transition"
            >
              Back to Course
            </Link>
            <Link
              href={`/curriculum/${courseId}`}
              className="rounded-xl border border-slate-700 px-6 py-3 text-center font-bold text-slate-300 hover:bg-slate-800 transition"
            >
              Browse Track Structure
            </Link>
          </div>
        </div>
      </main>
    );
  }

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

  return (
    <LessonPageClient
      courseId={courseId}
      lessonId={lessonId}
      course={course}
      lesson={lesson}
      courseLessons={courseLessons}
      currentIndex={currentIndex}
      isAdmin={isAdmin}
    />
  );
}
