"use client";

import type { CourseRecommendation } from "@/lib/ai-tutor/types";
import Link from "next/link";

interface Props {
  courses: CourseRecommendation[];
}

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: "bg-green-900/40 text-green-300",
  intermediate: "bg-blue-900/40 text-blue-300",
  advanced: "bg-purple-900/40 text-purple-300",
};

export default function RecommendedCourses({ courses }: Props) {
  if (courses.length === 0) return null;

  return (
    <section aria-labelledby="recommended-courses-heading">
      <h2
        id="recommended-courses-heading"
        className="mb-4 text-sm font-bold uppercase tracking-widest text-yellow-400"
      >
        Recommended Courses
      </h2>

      <ul className="space-y-3">
        {courses.map((course) => (
          <li key={course.courseId}>
            <Link
              href={course.url}
              className="group block rounded-xl bg-slate-800/60 p-4 transition hover:bg-slate-700/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              aria-label={`Start course: ${course.title}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-white group-hover:text-yellow-300 transition">
                  {course.title}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    DIFFICULTY_COLOR[course.difficulty] ?? "bg-slate-700 text-slate-300"
                  }`}
                >
                  {course.difficulty}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                {course.description}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {course.estimatedHours}h · {course.reason}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
