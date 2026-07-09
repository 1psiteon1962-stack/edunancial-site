"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { courseList, categories, categoryColors } from "@/data/course-platform";
import type { CourseCategory, Difficulty } from "@/data/course-platform";

const difficultyOptions: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

const difficultyBadge: Record<Difficulty, string> = {
  Beginner: "bg-green-800 text-green-300",
  Intermediate: "bg-yellow-800 text-yellow-300",
  Advanced: "bg-red-900 text-red-300",
};

export default function CourseCatalogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CourseCategory | "All">("All");
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | "All">("All");

  const filtered = useMemo(() => {
    return courseList.filter((c) => {
      const matchesSearch =
        search === "" ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || c.category === activeCategory;
      const matchesDifficulty = activeDifficulty === "All" || c.difficulty === activeDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [search, activeCategory, activeDifficulty]);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400 text-sm">
          COURSE CATALOG
        </p>
        <h1 className="mt-4 text-5xl font-black md:text-6xl">
          Explore Every Course
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          {courseList.length} courses across Real Estate, Paper Assets, Business, and more.
        </p>

        {/* Search */}
        <div className="mt-10 relative max-w-2xl">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses, topics, or tags…"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 pr-12"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
        </div>

        {/* Category filters */}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveCategory("All")}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              activeCategory === "All"
                ? "bg-yellow-500 text-black"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                activeCategory === cat
                  ? "bg-yellow-500 text-black"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty filters */}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveDifficulty("All")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              activeDifficulty === "All"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            All Levels
          </button>
          {difficultyOptions.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDifficulty(d)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                activeDifficulty === d
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </section>

      {/* Course Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <p className="text-2xl font-bold">No courses match your search.</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); setActiveDifficulty("All"); }}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="mb-8 text-slate-400 text-sm">
              Showing {filtered.length} of {courseList.length} courses
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-600 transition"
                >
                  {/* Color bar */}
                  <div className={`h-2 w-full ${course.color.startsWith("bg-slate-2") ? "bg-slate-300" : course.color}`} />
                  <div className="p-6">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${difficultyBadge[course.difficulty]}`}>
                        {course.difficulty}
                      </span>
                      {course.isFree && (
                        <span className="rounded-full bg-green-900 text-green-300 px-3 py-1 text-xs font-bold">
                          FREE
                        </span>
                      )}
                      {course.isFeatured && (
                        <span className="rounded-full bg-yellow-900 text-yellow-300 px-3 py-1 text-xs font-bold">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-black group-hover:text-yellow-400 transition">
                      {course.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                      {course.subtitle}
                    </p>
                    {/* Meta */}
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>📚 {course.lessons.length} lessons</span>
                      <span>⏱ {course.totalDuration}</span>
                      <span>👥 {course.enrolledCount.toLocaleString()} enrolled</span>
                    </div>
                    {/* Rating */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-yellow-400 font-bold">{course.rating}</span>
                      <span className="text-yellow-400 text-sm">{"★".repeat(Math.round(course.rating))}</span>
                      <span className="text-slate-500 text-xs">({course.reviewCount})</span>
                    </div>
                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {course.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Category Sections */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="text-3xl font-black mb-10">Browse by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((cat) => {
            const count = courseList.filter((c) => c.category === cat).length;
            const colorClass = categoryColors[cat];
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`${colorClass} rounded-xl p-6 text-left hover:opacity-90 transition`}
              >
                <p className="text-xs font-bold uppercase tracking-widest opacity-75">{count} course{count !== 1 ? "s" : ""}</p>
                <p className="mt-2 text-lg font-black">{cat}</p>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
