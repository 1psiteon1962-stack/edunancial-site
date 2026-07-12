import Link from "next/link";
import { courseList, instructorList } from "@/data/course-platform";

export const metadata = {
  title: "Instructor Tools | Edunancial",
};

// Mock data for instructor dashboard
const mockStudents = 248;
const mockAssessments = 14;
const mockCompletions = 31;

function StatCard({ value, label, color = "text-yellow-400" }: { value: string | number; label: string; color?: string }) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 text-center">
      <p className={`text-4xl font-black ${color}`}>{value}</p>
      <p className="mt-2 text-sm text-slate-400">{label}</p>
    </div>
  );
}

export default function TeachersPage() {
  const recentActivity = [
    { student: "Alex M.", action: "Completed Lesson 3", course: "Financial Foundations", time: "2h ago" },
    { student: "Dana K.", action: "Passed Quiz", course: "RED: Real Estate", time: "4h ago" },
    { student: "Marcus T.", action: "Started Course", course: "BLUE: Business", time: "5h ago" },
    { student: "Priya R.", action: "Earned Certificate", course: "Financial Foundations", time: "1d ago" },
    { student: "James W.", action: "Completed Lesson 1", course: "WHITE: Paper Assets", time: "1d ago" },
  ];

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold text-sm">INSTRUCTOR TOOLS</p>
        <h1 className="mt-4 text-5xl font-black">Teacher Dashboard</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Track student progress, manage courses, review assessments, and issue certificates from one place.
        </p>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard value={mockStudents} label="Active Students" />
          <StatCard value={courseList.length} label="Courses" color="text-blue-400" />
          <StatCard value={mockAssessments} label="Assessments" color="text-purple-400" />
          <StatCard value={mockCompletions} label="Completions This Month" color="text-green-400" />
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

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {/* Course overview */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black">Course Overview</h2>
            <div className="space-y-3">
              {courseList.map((course) => {
                const enrolled = Math.floor(Math.random() * 100) + 20;
                const pct = Math.floor(Math.random() * 80) + 10;
                return (
                  <div key={course.id} className="rounded-xl bg-slate-900 border border-slate-800 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-3 w-3 rounded-full flex-shrink-0 ${
                          course.color.startsWith("bg-slate-2") ? "bg-slate-400" : course.color
                        }`} />
                        <span className="font-bold text-sm truncate">{course.title}</span>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0 text-xs text-slate-400">
                        <span>👥 {course.enrolledCount.toLocaleString()}</span>
                        <span>📚 {course.lessons.length} lessons</span>
                        <Link href={`/courses/${course.id}`} className="text-blue-400 hover:text-blue-300">View</Link>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800">
                      <div
                        className="h-1.5 rounded-full bg-blue-500"
                        style={{ width: `${Math.round((course.enrolledCount / 15000) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent activity */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <h3 className="font-black text-lg mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-black flex-shrink-0">
                      {item.student[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold">{item.student}</p>
                      <p className="text-xs text-slate-400">{item.action}</p>
                      <p className="text-xs text-slate-500">{item.course} · {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructors */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <h3 className="font-black text-lg mb-4">Instructors</h3>
              <div className="space-y-4">
                {instructorList.map((inst) => (
                  <div key={inst.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-black text-sm flex-shrink-0">
                      {inst.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{inst.name}</p>
                      <p className="text-xs text-slate-400">{inst.students.toLocaleString()} students · ⭐ {inst.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
