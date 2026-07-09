"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";

const PROGRESS_DATA = [
  {
    id: "personal-finance",
    title: "Personal Financial Management",
    track: "WHITE",
    trackColor: "bg-white text-slate-900",
    completed: 10,
    total: 10,
    lastAccessed: "2 days ago",
    certificate: true,
  },
  {
    id: "re-fundamentals",
    title: "Real Estate Fundamentals",
    track: "RED",
    trackColor: "bg-red-700",
    completed: 9,
    total: 12,
    lastAccessed: "5 days ago",
    certificate: false,
  },
  {
    id: "biz-kpi",
    title: "Executive KPI Dashboard",
    track: "BLUE",
    trackColor: "bg-blue-700",
    completed: 12,
    total: 12,
    lastAccessed: "1 week ago",
    certificate: true,
  },
  {
    id: "inv-stocks",
    title: "Stocks & ETF Investing",
    track: "WHITE",
    trackColor: "bg-white text-slate-900",
    completed: 8,
    total: 12,
    lastAccessed: "3 days ago",
    certificate: false,
  },
  {
    id: "econ-defense",
    title: "Economic Self-Defense",
    track: "FOUNDATION",
    trackColor: "bg-green-700",
    completed: 8,
    total: 8,
    lastAccessed: "2 weeks ago",
    certificate: true,
  },
  {
    id: "biz-startup",
    title: "Startup Fundamentals",
    track: "BLUE",
    trackColor: "bg-blue-700",
    completed: 3,
    total: 11,
    lastAccessed: "1 day ago",
    certificate: false,
  },
];

export default function CourseProgressClient() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">Loading…</p>
      </main>
    );
  }

  const completedCourses = PROGRESS_DATA.filter((c) => c.completed === c.total).length;
  const inProgress = PROGRESS_DATA.filter((c) => c.completed > 0 && c.completed < c.total).length;
  const totalHours = PROGRESS_DATA.reduce((sum, c) => sum + Math.round((c.completed / c.total) * 8), 0);
  const certificates = PROGRESS_DATA.filter((c) => c.certificate).length;

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <nav className="mb-8 flex gap-2 text-sm text-slate-400">
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <span>/</span>
          <span className="text-white">Course Progress</span>
        </nav>

        <h1 className="text-4xl font-black">Course Progress</h1>
        <p className="mt-3 text-slate-400">
          Track your learning journey across all Financial Competency tracks.
        </p>

        {/* Summary cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Completed", value: completedCourses, color: "bg-green-700" },
            { label: "In Progress", value: inProgress, color: "bg-blue-700" },
            { label: "Learning Hours", value: totalHours, color: "bg-yellow-600" },
            { label: "Certificates", value: certificates, color: "bg-purple-700" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`${color} rounded-2xl p-6 text-center`}>
              <p className="text-sm font-semibold uppercase tracking-wider opacity-80">{label}</p>
              <p className="mt-3 text-5xl font-black">{value}</p>
            </div>
          ))}
        </div>

        {/* Overall progress */}
        <div className="mt-10 rounded-2xl bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">Overall Learning Progress</h2>
          <div className="mt-2 text-slate-400 text-sm">
            {PROGRESS_DATA.reduce((sum, c) => sum + c.completed, 0)} of{" "}
            {PROGRESS_DATA.reduce((sum, c) => sum + c.total, 0)} lessons completed
          </div>
          <div className="mt-4 h-4 rounded-full bg-slate-700">
            <div
              className="h-4 rounded-full bg-blue-500 transition-all"
              style={{
                width: `${Math.round(
                  (PROGRESS_DATA.reduce((sum, c) => sum + c.completed, 0) /
                    PROGRESS_DATA.reduce((sum, c) => sum + c.total, 0)) *
                    100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Course list */}
        <div className="mt-10 space-y-5">
          <h2 className="text-2xl font-bold">My Courses</h2>
          {PROGRESS_DATA.map((course) => {
            const pct = Math.round((course.completed / course.total) * 100);
            const complete = pct === 100;
            return (
              <div
                key={course.id}
                className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${course.trackColor}`}>
                        {course.track}
                      </span>
                      {complete && (
                        <span className="rounded-full bg-green-800/40 px-2 py-0.5 text-xs font-semibold text-green-400">
                          ✓ Completed
                        </span>
                      )}
                      {course.certificate && (
                        <span className="rounded-full bg-yellow-800/40 px-2 py-0.5 text-xs font-semibold text-yellow-400">
                          🎓 Certificate
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-xl font-bold">{course.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {course.completed} of {course.total} lessons · Last accessed {course.lastAccessed}
                    </p>
                  </div>
                  <Link
                    href={`/courses/${course.id}`}
                    className={`shrink-0 rounded-xl px-5 py-2 text-sm font-bold transition ${
                      complete
                        ? "border border-green-600 text-green-400 hover:bg-green-700 hover:text-white"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {complete ? "Review" : "Continue"}
                  </Link>
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{pct}% complete</span>
                    <span>{course.total - course.completed} lessons remaining</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700">
                    <div
                      className={`h-2 rounded-full transition-all ${complete ? "bg-green-500" : "bg-blue-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex gap-4">
          <Link
            href="/course-catalog"
            className="rounded-xl bg-blue-600 px-8 py-3 font-bold hover:bg-blue-700"
          >
            Browse More Courses
          </Link>
          <Link
            href="/my-certificates"
            className="rounded-xl border border-yellow-500 px-8 py-3 font-bold text-yellow-400 hover:bg-yellow-600 hover:text-white"
          >
            View Certificates
          </Link>
        </div>
      </section>
    </main>
  );
}
