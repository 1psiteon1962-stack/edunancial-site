import Link from "next/link";

import { requireAdminPageSession } from "@/lib/admin-content/auth";
import { listCourses } from "@/lib/admin-content/course-storage";

export const metadata = { title: "Courses | Edunancial Admin" };

const PATH_COLORS: Record<string, string> = {
  red: "bg-red-500/20 text-red-300 border border-red-500/30",
  white: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
  blue: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  published: "bg-green-500/20 text-green-300 border border-green-500/30",
  archived: "bg-slate-600/20 text-slate-400 border border-slate-600/30",
};

export default async function AdminCoursesPage() {
  await requireAdminPageSession();
  const courses = await listCourses();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Admin</p>
            <h1 className="mt-2 text-4xl font-black">Course Management</h1>
            <p className="mt-2 text-slate-400">
              {courses.length} course{courses.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/courses/import"
              className="rounded-xl border border-blue-500/40 px-5 py-3 font-semibold text-blue-300 hover:border-blue-400"
            >
              Import Course
            </Link>
            <Link
              href="/admin/courses/new"
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
            >
              + New Course
            </Link>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-white/10 bg-[#101a2f] p-12 text-center">
            <p className="text-2xl font-bold text-white">No courses yet</p>
            <p className="mt-3 text-slate-400">
              Create your first course or import a Claude course package.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/admin/courses/new"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
              >
                Create Course
              </Link>
              <Link
                href="/admin/courses/import"
                className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-slate-300 hover:border-white/40"
              >
                Import Course
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#101a2f]">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.2em] text-slate-400">
              <span>Course</span>
              <span>Path</span>
              <span>Status</span>
              <span>Modules</span>
              <span>Language</span>
              <span>Actions</span>
            </div>
            {courses.map((course) => (
              <div
                key={course.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 border-b border-white/5 px-6 py-4 text-sm last:border-b-0"
              >
                <div>
                  <p className="font-semibold text-white">{course.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{course.slug}</p>
                </div>
                <span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${PATH_COLORS[course.path] ?? ""}`}
                  >
                    {course.path.toUpperCase()}
                  </span>
                </span>
                <span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[course.status] ?? ""}`}
                  >
                    {course.status}
                  </span>
                </span>
                <span className="text-slate-300">{course.modules.length}</span>
                <span className="text-slate-300">{course.language.toUpperCase()}</span>
                <Link
                  href={`/admin/courses/${course.id}`}
                  className="font-semibold text-blue-300 hover:text-blue-200"
                >
                  Edit →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
