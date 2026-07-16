"use client";

// ─────────────────────────────────────────────────────────────
// Lesson Page — Global Video Learning Architecture
// Full-featured lesson experience for all Edunancial regions.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { courses, lessons } from "@/data/course-platform";
import { LegacyVideoPlayer } from "@/components/video-learning/VideoPlayer";
import LessonObjectives from "@/components/video-learning/LessonObjectives";
import LessonDownloads from "@/components/video-learning/LessonDownloads";
import ReflectionQuestions from "@/components/video-learning/ReflectionQuestions";
import LessonAICoach from "@/components/video-learning/LessonAICoach";

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
}

type LessonTab = "notes" | "transcript" | "downloads";

export default function LessonPage({ params }: Props) {
  const { courseId, lessonId } = use(params);
  const course = courses[courseId];
  const lesson = lessons[lessonId];
  if (!course || !lesson) notFound();

  const courseLessons = course.lessons.map((id) => lessons[id]).filter(Boolean);
  const currentIndex = courseLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;

  const [activeTab, setActiveTab] = useState<LessonTab>("notes");

  // Build a lookup map for lesson titles (used by AI Coach)
  const lessonTitleMap: Record<string, string> = Object.fromEntries(
    Object.values(lessons).map((l) => [l.id, l.title])
  );

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 grid gap-8 lg:grid-cols-4">
        {/* ── Lesson sidebar ──────────────────────────────── */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <Link
                href={`/courses/${courseId}`}
                className="text-xs text-yellow-400 hover:text-yellow-300"
              >
                ← Back to Course
              </Link>
              <p className="mt-2 font-black text-sm line-clamp-2">{course.title}</p>
              <p className="text-xs text-slate-400 mt-1">{courseLessons.length} lessons</p>
            </div>
            <div className="divide-y divide-slate-800 max-h-[60vh] overflow-y-auto">
              {courseLessons.map((l, idx) => (
                <Link
                  key={l.id}
                  href={`/courses/${courseId}/lessons/${l.id}`}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition ${
                    l.id === lessonId
                      ? "bg-slate-800 border-l-2 border-yellow-400"
                      : ""
                  }`}
                >
                  <span className="text-xs w-5 text-center text-slate-400">{idx + 1}</span>
                  <span
                    className={`text-sm flex-1 leading-tight ${
                      l.id === lessonId
                        ? "text-yellow-400 font-bold"
                        : "text-slate-300"
                    }`}
                  >
                    {l.title}
                  </span>
                  <span className="text-xs text-slate-500 flex-shrink-0">{l.duration}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 flex-wrap">
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

          {/* Lesson header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <p className="text-xs uppercase tracking-widest text-yellow-400 font-bold">
                Lesson {currentIndex + 1} of {courseLessons.length}
              </p>
              {lesson.estimatedMinutes && (
                <span className="text-xs text-slate-500">
                  · {lesson.estimatedMinutes} min total
                </span>
              )}
              {lesson.closedCaptionsAvailable && (
                <span
                  title="Closed captions available"
                  className="text-xs bg-slate-800 text-slate-400 rounded px-1.5 py-0.5 font-bold"
                >
                  CC
                </span>
              )}
              {lesson.publicationStatus === "draft" && (
                <span className="text-xs bg-yellow-900 text-yellow-400 rounded px-1.5 py-0.5 font-bold">
                  DRAFT
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black md:text-4xl">{lesson.title}</h1>
            <p className="mt-2 text-slate-300">{lesson.description}</p>
          </div>

          {/* ── Video player ─────────────────────────────────── */}
          <LegacyVideoPlayer
            videoUrl={lesson.videoUrl}
            title={lesson.title}
            closedCaptions={lesson.closedCaptionsAvailable}
          />

          {/* ── Learning objectives + key definitions ────────── */}
          <LessonObjectives
            objectives={lesson.objectives}
            definitions={lesson.definitions}
            estimatedMinutes={lesson.estimatedMinutes}
          />

          {/* ── Tabs: Notes / Transcript / Downloads ────────── */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="flex border-b border-slate-800 overflow-x-auto">
              {(["notes", "transcript", "downloads"] as LessonTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-bold capitalize transition whitespace-nowrap ${
                    activeTab === tab
                      ? "border-b-2 border-yellow-400 text-yellow-400"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-6">
              {activeTab === "notes" && (
                <div>
                  <h3 className="text-lg font-black mb-3">Lesson Notes</h3>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                    {lesson.notes}
                  </p>
                </div>
              )}
              {activeTab === "transcript" && (
                <div>
                  <h3 className="text-lg font-black mb-3">Transcript</h3>
                  <p className="text-slate-400 italic">
                    {lesson.transcript ??
                      "Transcript coming soon. Notes are available in the Notes tab."}
                  </p>
                </div>
              )}
              {activeTab === "downloads" && (
                <LessonDownloads
                  resources={lesson.resources}
                  legacyDownloadUrl={lesson.downloadUrl}
                  lessonTitle={lesson.title}
                />
              )}
            </div>
          </div>

          {/* ── Reflection questions ─────────────────────────── */}
          {lesson.reflectionQuestions && lesson.reflectionQuestions.length > 0 && (
            <ReflectionQuestions questions={lesson.reflectionQuestions} />
          )}

          {/* ── Quiz ─────────────────────────────────────────── */}
          {lesson.quizId && (
            <div className="rounded-2xl bg-purple-950 border border-purple-800 p-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-black text-lg text-purple-300">🧠 Lesson Quiz</p>
                <p className="text-slate-300 text-sm mt-1">
                  Test your understanding before moving on.
                </p>
              </div>
              <Link
                href={`/quizzes/${lesson.quizId}`}
                className="flex-shrink-0 rounded-xl bg-purple-600 px-6 py-3 font-bold text-white hover:bg-purple-500 transition"
              >
                Take Quiz
              </Link>
            </div>
          )}

          {/* ── AI Coach ─────────────────────────────────────── */}
          <LessonAICoach
            lessonTitle={lesson.title}
            courseId={courseId}
            aiCoach={lesson.aiCoach}
            suggestedNextLessonId={lesson.suggestedNextLessonId ?? nextLesson?.id}
            lessonTitles={lessonTitleMap}
          />

          {/* ── Navigation ───────────────────────────────────── */}
          <div className="flex items-center justify-between gap-4 pt-2">
            {prevLesson ? (
              <Link
                href={`/courses/${courseId}/lessons/${prevLesson.id}`}
                className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-5 py-3 text-sm font-bold hover:bg-slate-800 transition"
              >
                ←{" "}
                <span className="hidden sm:inline">{prevLesson.title}</span>
                <span className="sm:hidden">Previous</span>
              </Link>
            ) : (
              <div />
            )}

            <Link
              href={`/courses/${courseId}`}
              className="text-sm text-slate-400 hover:text-white hidden sm:block"
            >
              Back to Course
            </Link>

            {nextLesson ? (
              <Link
                href={`/courses/${courseId}/lessons/${nextLesson.id}`}
                className="flex items-center gap-2 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-black text-black hover:bg-yellow-400 transition"
              >
                <span className="hidden sm:inline">{nextLesson.title}</span>
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
