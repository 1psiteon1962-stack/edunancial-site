import Link from "next/link";
import { courseList } from "@/data/course-platform";

export const metadata = {
  title: "Instructor Tools | Edunancial",
};

export default function TeachersPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold text-sm">INSTRUCTOR TOOLS</p>
        <h1 className="mt-4 text-5xl font-black">Instructor Dashboard</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Manage courses, assessments, and learner progress from one place.
        </p>

        {/* Summary */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 text-center">
            <p className="text-4xl font-black text-blue-400">{courseList.length}</p>
            <p className="mt-2 text-sm text-slate-400">Courses</p>
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 text-center">
            <p className="text-4xl font-black text-yellow-400">
              {courseList.reduce((sum, c) => sum + c.lessons.length, 0)}
            </p>
            <p className="mt-2 text-sm text-slate-400">Total Lessons</p>
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 text-center">
            <p className="text-4xl font-black text-green-400">
              {courseList.filter((c) => c.isFree).length}
            </p>
            <p className="mt-2 text-sm text-slate-400">Free Courses</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[
            { icon: "📚", label: "Manage Courses", href: "/admin/courses" },
            { icon: "📊", label: "View Analytics", href: "/admin/dashboard" },
            { icon: "🎓", label: "Issue Certificates", href: "/admin/certificates" },
            { icon: "📝", label: "Manage Quizzes", href: "/admin/quizzes" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="rounded-xl bg-slate-900 border border-slate-800 p-6 text-center hover:border-slate-600 transition"
            >
              <span className="text-3xl">{action.icon}</span>
              <p className="mt-3 font-bold text-sm">{action.label}</p>
            </Link>
          ))}
        </div>

        {/* Course list */}
        <div className="mt-16">
          <h2 className="text-2xl font-black mb-6">All Courses</h2>
          <div className="space-y-3">
            {courseList.map((course) => (
              <div key={course.id} className="rounded-xl bg-slate-900 border border-slate-800 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-3 w-3 rounded-full flex-shrink-0 ${
                      course.color.startsWith("bg-slate-2") ? "bg-slate-400" : course.color
                    }`} />
                    <span className="font-bold text-sm truncate">{course.title}</span>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 text-xs text-slate-400">
                    <span>📚 {course.lessons.length} lessons</span>
                    <Link href={`/courses/${course.id}`} className="text-blue-400 hover:text-blue-300">View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
