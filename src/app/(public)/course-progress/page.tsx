"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { useMemberProgress } from "@/components/member/useMemberProgress";
import { useAuth } from "@/lib/authContext";

export default function CourseProgressPage() {
  const { t } = useInternationalPreferences();
  const { user, loading: authLoading } = useAuth();
  const { progress, loading } = useMemberProgress();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, router, user]);

  if (authLoading || loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08101f] text-white">
        <p className="text-slate-400">Loading…</p>
      </main>
    );
  }

  const totalLessons = progress.reduce((sum, course) => sum + course.total_lessons, 0);
  const totalDone = progress.reduce((sum, course) => sum + course.completed_lessons_count, 0);
  const overallPct = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{t("courseProgress.label")}</p>
        <h1 className="mt-4 text-5xl font-black">{t("courseProgress.title")}</h1>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-sm text-slate-400">{t("courseProgress.overallLabel")}</p>
              <p className="mt-1 text-4xl font-black text-blue-400">{overallPct}%</p>
            </div>
            <p className="text-sm text-slate-400">
              {t("courseProgress.lessonsLabel", { done: totalDone, total: totalLessons })}
            </p>
          </div>
          <div className="h-4 w-full rounded-full bg-slate-800">
            <div className="h-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all" style={{ width: `${overallPct}%` }} />
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <h2 className="text-2xl font-black">{t("courseProgress.breakdownLabel")}</h2>
          {progress.map((course) => (
            <div key={course.courseId} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black">{course.title}</h3>
                  <p className="text-sm text-slate-400">{course.category} · {course.difficulty}</p>
                </div>
                <span className={`text-xl font-black ${course.progress_percent === 100 ? "text-green-400" : "text-blue-400"}`}>{Math.round(course.progress_percent)}%</span>
              </div>
              <div className="mb-3 h-3 w-full rounded-full bg-slate-800">
                <div className={`h-3 rounded-full transition-all ${course.progress_percent === 100 ? "bg-green-500" : "bg-blue-500"}`} style={{ width: `${course.progress_percent}%` }} />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{t("courseProgress.completeTemplate", { done: course.completed_lessons_count, total: course.total_lessons })}</span>
                {course.completed ? (
                  <Link href="/my-certificates" className="font-bold text-green-400 hover:text-green-300">
                    ✅ {t("courseProgress.certificateLabel")}
                  </Link>
                ) : (
                  <Link href={course.continue_href} className="font-bold text-yellow-400 hover:text-yellow-300">
                    {course.total_lessons > 0 ? t("courseProgress.continueLabel") : "View Track"}
                  </Link>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.lessonIds.map((lessonId) => (
                  <div key={lessonId} className={`h-2.5 w-2.5 rounded-full ${course.completed_lesson_ids.includes(lessonId) ? "bg-blue-500" : "bg-slate-700"}`} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link href="/my-courses" className="rounded-xl bg-yellow-500 px-6 py-3 font-black text-black transition hover:bg-yellow-400">
            {t("courseProgress.primaryLabel")}
          </Link>
          <Link href="/course-catalog" className="rounded-xl border border-slate-600 px-6 py-3 font-bold text-slate-300 transition hover:bg-slate-800">
            {t("courseProgress.secondaryLabel")}
          </Link>
        </div>
      </section>
    </main>
  );
}
