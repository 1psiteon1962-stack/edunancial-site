"use client";

import Link from "next/link";
import { useState } from "react";
import { courseList } from "@/data/course-platform";

// Mock initial bookmarks — in production stored in database/localStorage
const INITIAL_BOOKMARKS = new Set(["red-real-estate", "white-paper-assets", "financial-foundations"]);

export default function FavoritesPage() {
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set(INITIAL_BOOKMARKS));
  const [search, setSearch] = useState("");

  function toggle(id: string) {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const savedCourses = courseList.filter((c) => bookmarked.has(c.id));
  const filtered = savedCourses.filter(
    (c) =>
      search === "" ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400 text-sm">BOOKMARKS</p>
        <h1 className="mt-4 text-5xl font-black">Saved Courses</h1>
        <p className="mt-4 text-slate-300">
          {bookmarked.size} course{bookmarked.size !== 1 ? "s" : ""} saved for later.
        </p>

        {bookmarked.size > 0 && (
          <div className="mt-8 relative max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter saved courses…"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500"
            />
          </div>
        )}

        {/* Saved courses */}
        {filtered.length === 0 && bookmarked.size === 0 ? (
          <div className="mt-20 text-center">
            <span className="text-6xl">🔖</span>
            <h2 className="mt-6 text-2xl font-black">No Bookmarks Yet</h2>
            <p className="mt-4 text-slate-300 max-w-md mx-auto">
              Bookmark courses to save them for later. Browse the catalog to find courses you&apos;re interested in.
            </p>
            <Link
              href="/course-catalog"
              className="mt-8 inline-block rounded-xl bg-yellow-500 px-8 py-4 font-black text-black hover:bg-yellow-400 transition"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <div key={course.id} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden group">
                <div className={`h-1.5 w-full ${course.color.startsWith("bg-slate-2") ? "bg-slate-400" : course.color}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-black group-hover:text-yellow-400 transition">
                      {course.title}
                    </h2>
                    <button
                      onClick={() => toggle(course.id)}
                      title="Remove bookmark"
                      className="text-yellow-400 hover:text-slate-400 transition text-xl flex-shrink-0"
                    >
                      🔖
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{course.category} · {course.difficulty}</p>
                  <p className="mt-3 text-sm text-slate-300 line-clamp-2">{course.subtitle}</p>
                  <div className="mt-4 flex gap-x-4 text-xs text-slate-500">
                    <span>📚 {course.lessons.length} lessons</span>
                    <span>⏱ {course.totalDuration}</span>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex-1 rounded-xl bg-yellow-500 py-2.5 text-center text-sm font-black text-black hover:bg-yellow-400 transition"
                    >
                      View Course
                    </Link>
                    <Link
                      href={`/courses/${course.id}/lessons/${course.lessons[0]}`}
                      className="rounded-xl border border-slate-600 px-3 py-2.5 text-sm font-bold text-slate-300 hover:bg-slate-800 transition"
                    >
                      ▶ Start
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Browse to add more */}
        <div className="mt-16">
          <h2 className="text-2xl font-black mb-6">Add More Bookmarks</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {courseList
              .filter((c) => !bookmarked.has(c.id))
              .slice(0, 6)
              .map((course) => (
                <div key={course.id} className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-800 p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-3 w-3 rounded-full flex-shrink-0 ${
                      course.color.startsWith("bg-slate-2") ? "bg-slate-400" : course.color
                    }`} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{course.title}</p>
                      <p className="text-xs text-slate-400">{course.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle(course.id)}
                    className="ml-3 flex-shrink-0 text-slate-400 hover:text-yellow-400 transition text-xl"
                    title="Bookmark"
                  >
                    🔖
                  </button>
                </div>
              ))}
          </div>
          <div className="mt-6">
            <Link href="/course-catalog" className="text-sm text-yellow-400 hover:text-yellow-300 font-bold">
              Browse All Courses →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
