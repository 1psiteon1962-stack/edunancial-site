"use client";

import Link from "next/link";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { courseList } from "@/data/course-platform";

function ProgressLayout() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{t("courseProgress.label")}</p>
        <h1 className="mt-4 text-5xl font-black">{t("courseProgress.title")}</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Sign in to see your progress across all Edunancial courses.
        </p>

        <div className="mt-12">
          <h2 className="text-2xl font-black mb-6">Available Courses</h2>
          <div className="space-y-3">
            {courseList.map((course) => (
              <div key={course.id} className="rounded-xl bg-slate-900 border border-slate-800 p-5 flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`h-3 w-3 rounded-full flex-shrink-0 ${
                    course.color.startsWith("bg-slate-2") ? "bg-slate-400" : course.color
                  }`} />
                  <div className="min-w-0">
                    <p className="font-bold truncate">{course.title}</p>
                    <p className="text-xs text-slate-400">{course.lessons.length} lessons · {course.difficulty}</p>
                  </div>
                </div>
                <Link
                  href={`/courses/${course.id}`}
                  className="flex-shrink-0 rounded-xl border border-slate-600 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800 transition"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/login" className="rounded-xl bg-yellow-500 px-8 py-4 font-black text-black hover:bg-yellow-400 transition">
            Sign In to Track Progress
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function CourseProgressPage() {
  return <ProgressLayout />;
}
