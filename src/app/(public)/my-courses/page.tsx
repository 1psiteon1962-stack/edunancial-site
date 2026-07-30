"use client";

import Link from "next/link";
import { courseList } from "@/data/course-platform";

export default function MyCoursesPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400 text-sm">MY LEARNING</p>
        <h1 className="mt-4 text-5xl font-black">My Courses</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Sign in to track your course progress and pick up where you left off.
        </p>

        {/* Available courses */}
        <div className="mt-12">
          <h2 className="text-2xl font-black mb-6">Available Courses</h2>
          <div className="space-y-4">
            {courseList.map((course) => (
              <div key={course.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className={`h-14 w-14 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-lg ${
                    course.color.startsWith("bg-slate-2") ? "bg-slate-300 text-slate-900" : course.color
                  }`}>
                    {course.title[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black">{course.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">{course.subtitle}</p>
                    <p className="text-slate-500 text-xs mt-2">📚 {course.lessons.length} lessons · {course.difficulty}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Link
                      href={`/courses/${course.id}/lessons/${course.lessons[0]}`}
                      className="rounded-xl bg-yellow-500 px-5 py-2.5 text-center text-sm font-black text-black hover:bg-yellow-400 transition"
                    >
                      Start Course →
                    </Link>
                    <Link
                      href={`/courses/${course.id}`}
                      className="text-center text-xs text-slate-400 hover:text-white"
                    >
                      Course Overview
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-10 text-center">
          <h2 className="text-2xl font-black">Browse the Full Catalog</h2>
          <p className="mt-3 text-slate-300">
            Explore all {courseList.length} courses available on Edunancial.
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
