"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { courseList, lessonList, quizList } from "@/data/course-platform";

type ResultType = "course" | "lesson" | "quiz";

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  href: string;
  tag?: string;
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  courseList.forEach((c) => {
    results.push({
      id: c.id,
      type: "course",
      title: c.title,
      subtitle: c.subtitle,
      href: `/courses/${c.id}`,
      tag: c.category,
    });
  });

  lessonList.forEach((l) => {
    results.push({
      id: l.id,
      type: "lesson",
      title: l.title,
      subtitle: l.description,
      href: `/courses/${l.courseId}/lessons/${l.id}`,
      tag: l.duration,
    });
  });

  quizList.forEach((q) => {
    results.push({
      id: q.id,
      type: "quiz",
      title: q.title,
      subtitle: `${q.questions.length} questions · Pass: ${q.passingScore}%`,
      href: `/quizzes/${q.id}`,
    });
  });

  return results;
}

const allResults = buildIndex();

const typeIcon: Record<ResultType, string> = {
  course: "📚",
  lesson: "▶️",
  quiz: "🧠",
};

const typeBadge: Record<ResultType, string> = {
  course: "bg-blue-900 text-blue-300",
  lesson: "bg-slate-700 text-slate-300",
  quiz: "bg-purple-900 text-purple-300",
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<ResultType | "all">("all");

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allResults.filter((r) => {
      const matchType = activeType === "all" || r.type === activeType;
      const matchText =
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q) ||
        (r.tag ?? "").toLowerCase().includes(q);
      return matchType && matchText;
    });
  }, [query, activeType]);

  const popularSearches = ["Real Estate", "Budgeting", "Business", "Stocks", "ETFs", "Tax Liens", "KPIs", "Certificates"];

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400 text-sm">SEARCH</p>
        <h1 className="mt-4 text-5xl font-black">Find What You Need</h1>
        <p className="mt-4 text-slate-300">
          Search across {courseList.length} courses, {lessonList.length} lessons, and {quizList.length} quizzes.
        </p>

        {/* Search input */}
        <div className="mt-10 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, lessons, quizzes, topics…"
            autoFocus
            className="w-full rounded-2xl bg-slate-800 border border-slate-700 px-6 py-5 text-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500 pr-14"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl text-slate-400">🔍</span>
        </div>

        {/* Type filters */}
        <div className="mt-5 flex gap-2">
          {(["all", "course", "lesson", "quiz"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold capitalize transition ${
                activeType === type
                  ? "bg-yellow-500 text-black"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {type === "all" ? "All" : `${typeIcon[type]} ${type}s`}
            </button>
          ))}
        </div>

        {/* Popular searches (when no query) */}
        {!query && (
          <div className="mt-12">
            <p className="text-sm text-slate-400 mb-4">Popular Searches</p>
            <div className="flex flex-wrap gap-3">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="rounded-full bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="mt-12">
              <p className="text-sm text-slate-400 mb-4">Quick Navigation</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Course Catalog", href: "/course-catalog", icon: "📚" },
                  { label: "My Courses", href: "/my-courses", icon: "🎯" },
                  { label: "Quizzes", href: "/quizzes", icon: "🧠" },
                  { label: "Certificates", href: "/certificates", icon: "🎓" },
                  { label: "Course Progress", href: "/course-progress", icon: "📊" },
                  { label: "Instructor Tools", href: "/teachers", icon: "👨‍🏫" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl bg-slate-900 border border-slate-800 p-4 hover:border-slate-600 transition"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-bold text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {query && (
          <div className="mt-8">
            <p className="text-sm text-slate-400 mb-6">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>

            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-xl text-slate-400">No results found.</p>
                <p className="mt-2 text-sm text-slate-500">Try different keywords or browse the catalog.</p>
                <Link href="/course-catalog" className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 transition">
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.href}
                    className="flex items-start gap-4 rounded-xl bg-slate-900 border border-slate-800 p-5 hover:border-slate-600 transition group"
                  >
                    <span className="text-2xl mt-0.5 flex-shrink-0">{typeIcon[result.type]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${typeBadge[result.type]}`}>
                          {result.type}
                        </span>
                        {result.tag && (
                          <span className="text-xs text-slate-500">{result.tag}</span>
                        )}
                      </div>
                      <p className="font-black group-hover:text-yellow-400 transition">{result.title}</p>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-1">{result.subtitle}</p>
                    </div>
                    <span className="text-slate-500 group-hover:text-slate-300 transition flex-shrink-0">→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
