"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useMemberProgress } from "@/components/member/useMemberProgress";
import { useAuth } from "@/lib/authContext";

export default function MyCoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const { progress, loading } = useMemberProgress();
  const [activeTab, setActiveTab] = useState<"in-progress" | "completed" | "all">("in-progress");
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, router, user]);

  if (authLoading || loading || !user) {
    return <main className="flex min-h-screen items-center justify-center bg-[#08101f] text-white"><p className="text-slate-400">Loading…</p></main>;
  }

  const filtered = progress.filter((course) => {
    if (activeTab === "in-progress") return !course.completed;
    if (activeTab === "completed") return course.completed;
    return true;
  });

  const totalCompleted = progress.filter((course) => course.completed).length;
  const totalLessonsCompleted = progress.reduce((sum, course) => sum + course.completed_lessons_count, 0);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400 text-sm">MY LEARNING</p>
        <h1 className="mt-4 text-5xl font-black">My Courses</h1>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Enrolled", value: progress.length },
            { label: "Completed", value: totalCompleted },
            { label: "Lessons Done", value: totalLessonsCompleted },
            { label: "Certificates", value: totalCompleted },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-slate-900 border border-slate-800 p-5 text-center">
              <p className="text-3xl font-black text-yellow-400">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-1 rounded-xl bg-slate-900 border border-slate-800 p-1 w-fit">
          {(["in-progress", "completed", "all"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-lg px-5 py-2.5 text-sm font-bold capitalize transition ${activeTab === tab ? "bg-yellow-500 text-black" : "text-slate-400 hover:text-white"}`}>
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <p className="text-xl">No courses here yet.</p>
              <Link href="/course-catalog" className="mt-4 inline-block rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black">Browse Catalog</Link>
            </div>
          ) : filtered.map((course) => (
            <div key={course.courseId} className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-black">{course.title}</h2>
                  <p className="text-slate-400 text-sm mt-1">{course.category}</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>{course.completed_lessons_count} / {course.total_lessons} lessons complete</span>
                      <span>{Math.round(course.progress_percent)}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-800">
                      <div className={`h-2.5 rounded-full transition-all ${course.completed ? "bg-green-500" : "bg-blue-500"}`} style={{ width: `${course.progress_percent}%` }} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {course.completed ? (
                    <Link href="/my-certificates" className="rounded-xl bg-green-600 px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-green-500 transition">🎓 View Certificate</Link>
                  ) : (
                    <Link href={course.continue_href} className="rounded-xl bg-yellow-500 px-5 py-2.5 text-center text-sm font-black text-black hover:bg-yellow-400 transition">{course.completed_lessons_count === 0 ? "Start →" : "Continue →"}</Link>
                  )}
                  <Link href={`/courses/${course.courseId}`} className="text-center text-xs text-slate-400 hover:text-white">Course Overview</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
