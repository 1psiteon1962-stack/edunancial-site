import Link from "next/link";
import { courseList } from "@/data/course-platform";

export const metadata = {
  title: "Course Progress | Edunancial",
};

// Mock progress — in production comes from auth/database
const mockProgress: Record<string, number[]> = {
  "red-real-estate": [0, 1],
  "white-paper-assets": [0, 1, 2, 3],
  "blue-business": [0],
  "financial-foundations": [0, 1, 2, 3, 4],
};

export default function CourseProgressPage() {
  const progressData = courseList.map((course) => {
    const done = (mockProgress[course.id] ?? []).length;
    const pct = Math.round((done / course.lessons.length) * 100);
    return { ...course, done, pct };
  });

  const enrolled = progressData.filter((c) => c.pct > 0);
  const totalLessons = enrolled.reduce((s, c) => s + c.lessons.length, 0);
  const totalDone = enrolled.reduce((s, c) => s + c.done, 0);
  const overallPct = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400 text-sm">PROGRESS TRACKING</p>
        <h1 className="mt-4 text-5xl font-black">Course Progress</h1>

        {/* Overall progress */}
        <div className="mt-10 rounded-2xl bg-slate-900 border border-slate-800 p-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm">Overall Learning Progress</p>
              <p className="text-4xl font-black mt-1 text-blue-400">{overallPct}%</p>
            </div>
            <p className="text-slate-400 text-sm">{totalDone} / {totalLessons} lessons</p>
          </div>
          <div className="h-4 w-full rounded-full bg-slate-800">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>

        {/* Per-course breakdown */}
        <div className="mt-10 space-y-6">
          <h2 className="text-2xl font-black">Course Breakdown</h2>
          {enrolled.map((course) => (
            <div key={course.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-black">{course.title}</h3>
                  <p className="text-sm text-slate-400">{course.category} · {course.difficulty}</p>
                </div>
                <span className={`text-xl font-black ${course.pct === 100 ? "text-green-400" : "text-blue-400"}`}>
                  {course.pct}%
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-800 mb-3">
                <div
                  className={`h-3 rounded-full transition-all ${course.pct === 100 ? "bg-green-500" : "bg-blue-500"}`}
                  style={{ width: `${course.pct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{course.done} of {course.lessons.length} lessons complete</span>
                {course.pct === 100 ? (
                  <Link href="/my-certificates" className="text-green-400 font-bold hover:text-green-300">
                    ✅ Certificate Earned
                  </Link>
                ) : (
                  <Link
                    href={`/courses/${course.id}/lessons/${course.lessons[course.done] ?? course.lessons[0]}`}
                    className="text-yellow-400 font-bold hover:text-yellow-300"
                  >
                    Continue →
                  </Link>
                )}
              </div>
              {/* Lesson dots */}
              <div className="mt-4 flex flex-wrap gap-2">
                {course.lessons.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2.5 w-2.5 rounded-full ${
                      idx < course.done ? "bg-blue-500" : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link href="/my-courses" className="rounded-xl bg-yellow-500 px-6 py-3 font-black text-black hover:bg-yellow-400 transition">
            My Courses
          </Link>
          <Link href="/course-catalog" className="rounded-xl border border-slate-600 px-6 py-3 font-bold text-slate-300 hover:bg-slate-800 transition">
            Browse More Courses
          </Link>
        </div>
      </section>
    </main>
  );
}
