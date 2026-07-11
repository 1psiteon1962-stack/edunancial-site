"use client";

import Link from "next/link";
import { courseList, lessonList } from "@/data/course-platform";
import { useState } from "react";

// Mock progress data — in production this would come from a database/auth context
const mockProgress: Record<string, number[]> = {
  "red-real-estate": [0, 1],        // completed lesson indices
  "white-paper-assets": [0, 1, 2, 3],
  "blue-business": [0],
  "financial-foundations": [0, 1, 2, 3, 4],
};

export default function MyCoursesPage() {
  const [activeTab, setActiveTab] = useState<"in-progress" | "completed" | "all">("in-progress");

  const coursesWithProgress = courseList.map((course) => {
    const completedIndices = mockProgress[course.id] ?? [];
    const pct = Math.round((completedIndices.length / course.lessons.length) * 100);
    return { ...course, completedCount: completedIndices.length, pct };
  });

  const filtered = coursesWithProgress.filter((c) => {
    if (activeTab === "in-progress") return c.pct > 0 && c.pct < 100;
    if (activeTab === "completed") return c.pct === 100;
    return true;
  });

  const totalCompleted = coursesWithProgress.filter((c) => c.pct === 100).length;
  const totalLessonsCompleted = Object.values(mockProgress).reduce(
    (sum, arr) => sum + arr.length, 0
  );

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400 text-sm">MY LEARNING</p>
        <h1 className="mt-4 text-5xl font-black">My Courses</h1>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Enrolled", value: courseList.length },
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

        {/* Tabs */}
        <div className="mt-10 flex gap-1 rounded-xl bg-slate-900 border border-slate-800 p-1 w-fit">
          {(["in-progress", "completed", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-5 py-2.5 text-sm font-bold capitalize transition ${
                activeTab === tab
                  ? "bg-yellow-500 text-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Course cards */}
        <div className="mt-8 space-y-4">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <p className="text-xl">No courses here yet.</p>
              <Link href="/course-catalog" className="mt-4 inline-block rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black">
                Browse Catalog
              </Link>
            </div>
          ) : (
            filtered.map((course) => {
              const firstLesson = course.lessons[0];
              const nextLesson = course.lessons[course.completedCount] ?? course.lessons[0];
              return (
                <div key={course.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    {/* Color indicator */}
                    <div className={`h-14 w-14 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-lg ${
                      course.color.startsWith("bg-slate-2") ? "bg-slate-300 text-slate-900" : course.color
                    }`}>
                      {course.title[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-black">{course.title}</h2>
                      <p className="text-slate-400 text-sm mt-1">{course.subtitle}</p>
                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>{course.completedCount} / {course.lessons.length} lessons complete</span>
                          <span>{course.pct}%</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-slate-800">
                          <div
                            className={`h-2.5 rounded-full transition-all ${course.pct === 100 ? "bg-green-500" : "bg-blue-500"}`}
                            style={{ width: `${course.pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {course.pct === 100 ? (
                        <>
                          <Link
                            href="/my-certificates"
                            className="rounded-xl bg-green-600 px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-green-500 transition"
                          >
                            🎓 View Certificate
                          </Link>
                          <Link
                            href={`/courses/${course.id}/lessons/${firstLesson}`}
                            className="rounded-xl border border-slate-600 px-5 py-2.5 text-center text-sm font-bold text-slate-300 hover:bg-slate-800 transition"
                          >
                            Review
                          </Link>
                        </>
                      ) : (
                        <Link
                          href={`/courses/${course.id}/lessons/${nextLesson}`}
                          className="rounded-xl bg-yellow-500 px-5 py-2.5 text-center text-sm font-black text-black hover:bg-yellow-400 transition"
                        >
                          {course.pct === 0 ? "Start" : "Continue"} →
                        </Link>
                      )}
                      <Link
                        href={`/courses/${course.id}`}
                        className="text-center text-xs text-slate-400 hover:text-white"
                      >
                        Course Overview
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Explore more */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-10 text-center">
          <h2 className="text-2xl font-black">Expand Your Knowledge</h2>
          <p className="mt-3 text-slate-300">
            {courseList.length - filtered.length} more courses available in the catalog.
          </p>
          <Link
            href="/course-catalog"
            className="mt-6 inline-block rounded-xl bg-yellow-500 px-8 py-4 font-black text-black hover:bg-yellow-400 transition"
          >
            Browse Course Catalog
          </Link>
        </div>
      </section>
    </main>
  );
}
