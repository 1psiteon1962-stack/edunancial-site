"use client";

import Link from "next/link";

import type { ProductionCourse, ProductionLesson } from "@/lib/curriculum/production-catalog";

interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

interface Props {
  courseId: string;
  lessonId: string;
  course: ProductionCourse;
  lesson: ProductionLesson;
  courseLessons: ProductionLesson[];
  currentIndex: number;
  isAdmin: boolean;
  /** Server-rendered markdown HTML. Null when no markdown source exists. */
  renderedHtml: string | null;
  /** Table of contents extracted from the markdown headings. */
  toc: TocEntry[];
  /** Estimated reading time in minutes. Null when no markdown source. */
  readingTime: number | null;
  /** Previous lesson in the registry (may differ from course order). */
  registryPrev: { id: string; title: string } | null;
  /** Next lesson in the registry (may differ from course order). */
  registryNext: { id: string; title: string } | null;
  /** Other lessons in the same track/level. */
  relatedLessons: Array<{ id: string; title: string; lessonNumber: number }>;
}

export default function LessonPageClient({
  courseId,
  lessonId,
  course,
  lesson,
  courseLessons,
  currentIndex,
  isAdmin,
  renderedHtml,
  toc,
  readingTime,
  registryPrev,
  registryNext,
  relatedLessons,
}: Props) {
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;

  // Use registry prev/next if available (same-level); fall back to course order
  const prevLink = registryPrev
    ? { href: `/courses/${courseId}/lessons/${registryPrev.id}`, label: registryPrev.title }
    : prevLesson
    ? { href: `/courses/${courseId}/lessons/${prevLesson.id}`, label: prevLesson.title }
    : null;

  const nextLink = registryNext
    ? { href: `/courses/${courseId}/lessons/${registryNext.id}`, label: registryNext.title }
    : nextLesson
    ? { href: `/courses/${courseId}/lessons/${nextLesson.id}`, label: nextLesson.title }
    : null;

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      {isAdmin && (
        <div className="bg-yellow-600/20 border-b border-yellow-500/30 px-6 py-2 flex items-center gap-4 text-sm">
          <span className="font-bold text-yellow-300">🔑 Admin View</span>
          <Link
            href={`/admin/curriculum/lessons/${lesson.id}`}
            className="text-yellow-200 hover:text-yellow-100 underline"
          >
            Edit this lesson
          </Link>
          <Link href="/admin/curriculum" className="text-yellow-200 hover:text-yellow-100 underline">
            Curriculum Manager
          </Link>
        </div>
      )}
      <div className="mx-auto max-w-7xl px-4 py-8 grid gap-8 lg:grid-cols-4">
        {/* Lesson sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Course lesson list */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800">
                <Link href={`/courses/${courseId}`} className="text-xs text-yellow-400 hover:text-yellow-300">
                  ← Back to Course
                </Link>
                <p className="mt-2 font-black text-sm line-clamp-2">{course.title}</p>
                <p className="text-xs text-slate-400 mt-1">{courseLessons.length} lesson{courseLessons.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="divide-y divide-slate-800 max-h-[40vh] overflow-y-auto">
                {courseLessons.map((l, idx) => (
                  <Link
                    key={l.id}
                    href={`/courses/${courseId}/lessons/${l.id}`}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition ${
                      l.id === lessonId ? "bg-slate-800 border-l-2 border-yellow-400" : ""
                    }`}
                  >
                    <span className="text-xs w-5 text-center text-slate-400">{idx + 1}</span>
                    <span
                      className={`text-sm flex-1 leading-tight ${
                        l.id === lessonId ? "text-yellow-400 font-bold" : "text-slate-300"
                      }`}
                    >
                      {l.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Table of Contents */}
            {toc.length > 0 && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contents</p>
                </div>
                <nav className="px-3 py-3 max-h-[35vh] overflow-y-auto">
                  {toc.map((entry) => (
                    <a
                      key={entry.id}
                      href={`#${entry.id}`}
                      className={`block py-1 text-xs hover:text-yellow-400 transition ${
                        entry.level === 3 ? "pl-4 text-slate-500" : "pl-2 text-slate-400"
                      }`}
                    >
                      {entry.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/course-catalog" className="hover:text-white">
              Catalog
            </Link>
            <span>/</span>
            <Link href={`/courses/${courseId}`} className="hover:text-white">
              {course.title}
            </Link>
            <span>/</span>
            <span className="text-slate-200 truncate">{lesson.title}</span>
          </nav>

          {/* Lesson title */}
          <div>
            <p className="text-xs uppercase tracking-widest text-yellow-400 font-bold">
              Lesson {currentIndex + 1} of {courseLessons.length}
            </p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">{lesson.title}</h1>
            {lesson.description && (
              <p className="mt-2 text-slate-300">{lesson.description}</p>
            )}
            {readingTime !== null && (
              <p className="mt-2 text-xs text-slate-500">📖 {readingTime} min read</p>
            )}
          </div>

          {/* Mobile ToC */}
          {toc.length > 0 && (
            <details className="lg:hidden rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <summary className="px-5 py-4 cursor-pointer text-sm font-bold text-slate-300 hover:text-white">
                Table of Contents
              </summary>
              <nav className="px-5 pb-4 border-t border-slate-800 pt-3">
                {toc.map((entry) => (
                  <a
                    key={entry.id}
                    href={`#${entry.id}`}
                    className={`block py-1 text-sm hover:text-yellow-400 transition ${
                      entry.level === 3 ? "pl-4 text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {entry.text}
                  </a>
                ))}
              </nav>
            </details>
          )}

          {/* Markdown lesson body */}
          {renderedHtml ? (
            <article
              className="prose-curriculum rounded-2xl bg-slate-900/50 border border-slate-800 p-6 md:p-8"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          ) : (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center">
              <p className="text-slate-400">Lesson content is being prepared. Check back soon.</p>
            </div>
          )}

          {/* Related Lessons */}
          {relatedLessons.length > 0 && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <h3 className="font-black text-base mb-4">Other Lessons in This Level</h3>
              <div className="space-y-2">
                {relatedLessons.slice(0, 5).map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/courses/${courseId}/lessons/${rel.id}`}
                    className="flex items-center gap-3 rounded-xl px-4 py-2 hover:bg-slate-800 transition text-sm"
                  >
                    <span className="w-5 text-center text-slate-500 text-xs">{rel.lessonNumber}</span>
                    <span className="text-slate-300 hover:text-yellow-400 transition">{rel.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            {prevLink ? (
              <Link
                href={prevLink.href}
                className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-5 py-3 text-sm font-bold hover:bg-slate-800 transition max-w-[45%]"
              >
                ←{" "}
                <span className="hidden sm:inline truncate">{prevLink.label}</span>
                <span className="sm:hidden">Previous</span>
              </Link>
            ) : (
              <div />
            )}

            <Link href={`/courses/${courseId}`} className="text-sm text-slate-400 hover:text-white flex-shrink-0">
              Back to Course
            </Link>

            {nextLink ? (
              <Link
                href={nextLink.href}
                className="flex items-center gap-2 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-black text-black hover:bg-yellow-400 transition max-w-[45%]"
              >
                <span className="hidden sm:inline truncate">{nextLink.label}</span>
                <span className="sm:hidden">Next</span> →
              </Link>
            ) : (
              <Link
                href={`/courses/${courseId}`}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white hover:bg-green-500 transition"
              >
                ✅ Complete Course
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
