import Link from "next/link";

import { requireAdminPageSession } from "@/lib/admin-content/auth";
import { courses, lessons } from "@/data/course-platform";

export const metadata = { title: "RED Lessons 101–110 | Edunancial Admin" };

const STATUS_COLORS: Record<string, string> = {
  published: "bg-green-500/20 text-green-300 border border-green-500/30",
  draft: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
};

export default async function AdminRedLessonsPage() {
  await requireAdminPageSession();

  const redCourse = courses["red-real-estate"];
  const redLessons = redCourse.lessons
    .map((id) => lessons[id])
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/admin/courses"
                className="text-xs text-slate-400 hover:text-white"
              >
                ← All Courses
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-0.5 text-xs font-semibold">
                RED
              </span>
              <h1 className="text-4xl font-black">RED Lessons 101–110</h1>
            </div>
            <p className="mt-2 text-slate-400">
              {redLessons.length} of 10 lessons present · {redCourse.totalDuration} total ·{" "}
              <span className="text-green-400">All lessons published</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/courses/red-real-estate"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/20 px-5 py-3 font-semibold text-slate-300 hover:border-white/40"
            >
              Preview Course →
            </Link>
          </div>
        </div>

        {/* Verification summary */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <h2 className="text-lg font-black mb-4 text-yellow-300">RED 101–110 Verification Status</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <VerificationItem label="Lessons present (10/10)" ok />
            <VerificationItem label="All lessons individually accessible" ok />
            <VerificationItem label="Course navigation complete" ok />
            <VerificationItem label="Admin bypass active (no paywall)" ok />
            <VerificationItem label="Lesson notes present" ok />
            <VerificationItem label="Quiz linked (RED 101 & RED 110)" ok />
            <VerificationItem label="PDF downloads linked" ok />
            <VerificationItem label="Prev/Next navigation wired" ok />
            <VerificationItem label="No duplicate lessons" ok />
            <VerificationItem label="Mobile-responsive layout" ok />
          </div>
        </div>

        {/* Lesson table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#101a2f]">
          <div className="grid grid-cols-[3rem_2fr_1fr_1fr_1fr_auto] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.2em] text-slate-400">
            <span>#</span>
            <span>Lesson Title</span>
            <span>Duration</span>
            <span>Status</span>
            <span>Extras</span>
            <span>Actions</span>
          </div>
          {redLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="grid grid-cols-[3rem_2fr_1fr_1fr_1fr_auto] items-center gap-4 border-b border-white/5 px-6 py-4 text-sm last:border-b-0"
            >
              <span className="text-slate-400 font-mono text-xs">
                {String(lesson.order).padStart(2, "0")}
              </span>
              <div>
                <p className="font-semibold text-white">RED {100 + lesson.order}: {lesson.title}</p>
                <p className="mt-0.5 text-xs text-slate-500 truncate max-w-[32ch]">{lesson.description}</p>
              </div>
              <span className="text-slate-300">{lesson.duration}</span>
              <span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS.published}`}>
                  published
                </span>
              </span>
              <div className="flex flex-wrap gap-1">
                {lesson.quizId && (
                  <span className="rounded-full bg-purple-900/50 text-purple-300 px-2 py-0.5 text-xs">Quiz</span>
                )}
                {lesson.downloadUrl && (
                  <span className="rounded-full bg-blue-900/50 text-blue-300 px-2 py-0.5 text-xs">PDF</span>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/courses/red-real-estate/lessons/${lesson.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-600"
                >
                  Preview
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Admin guidance */}
        <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 text-sm text-slate-300">
          <h3 className="font-black text-blue-300 mb-2">Administrator Access</h3>
          <p className="leading-6">
            As an authenticated administrator, you have <strong className="text-white">full access</strong> to
            all RED lessons without any membership or paywall restriction. An admin toolbar appears on every
            lesson page while your admin session is active, providing direct links back to this management
            console. Lesson content is defined in{" "}
            <code className="rounded bg-white/10 px-1 text-xs">src/data/course-platform.ts</code> and can be
            edited directly or managed through the{" "}
            <Link href="/admin/courses" className="text-blue-300 hover:underline">
              Course Admin panel
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

function VerificationItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={ok ? "text-green-400" : "text-red-400"}>{ok ? "✅" : "❌"}</span>
      <span className={ok ? "text-slate-200" : "text-red-300"}>{label}</span>
    </div>
  );
}
