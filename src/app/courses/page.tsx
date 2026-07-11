import Link from "next/link";
import { courseList } from "@/data/course-platform";

export const metadata = {
  title: "Courses | Edunancial",
};

const tracks = [
  {
    color: "RED",
    title: "Real Estate Competency",
    description:
      "Residential • Commercial • Tax Liens • Tax Deeds • 1031 Exchanges • Creative Financing",
    href: "/courses/red-real-estate",
    bg: "bg-red-700",
  },
  {
    color: "WHITE",
    title: "Financial Asset Competency",
    description:
      "Budgeting • Credit • Stocks • ETFs • Options • Precious Metals • Retirement",
    href: "/courses/white-paper-assets",
    bg: "bg-slate-200 text-slate-900",
  },
  {
    color: "BLUE",
    title: "Business Competency",
    description:
      "Entrepreneurship • Marketing • KPIs • Profit • Leadership • Scaling",
    href: "/courses/blue-business",
    bg: "bg-blue-700",
  },
];

export default function CoursesPage() {
  const featured = courseList.filter((c) => c.isFeatured);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="uppercase tracking-[0.4em] text-yellow-400 font-bold text-sm">
          COURSE LIBRARY
        </p>
        <h1 className="mt-4 text-6xl font-black md:text-7xl">
          Build Financial Competency
        </h1>
        <p className="mt-6 max-w-3xl text-xl text-slate-300 leading-relaxed">
          Financial literacy provides the foundation.
          Financial competency is built through disciplined action.
        </p>

        {/* Three tracks */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tracks.map((track) => (
            <Link
              key={track.color}
              href={track.href}
              className={`${track.bg} rounded-2xl p-10 hover:opacity-90 transition`}
            >
              <h2 className="text-5xl font-black">{track.color}</h2>
              <h3 className="mt-6 text-2xl font-bold">{track.title}</h3>
              <p className="mt-4 text-lg opacity-80">{track.description}</p>
              <p className="mt-8 font-bold text-sm">Explore Track →</p>
            </Link>
          ))}
        </div>

        {/* All featured courses */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black">Featured Courses</h2>
            <Link href="/course-catalog" className="text-yellow-400 hover:text-yellow-300 font-bold text-sm">
              View All Courses →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-600 transition group"
              >
                <div className={`h-1.5 w-full ${course.color.startsWith("bg-slate-2") ? "bg-slate-300" : course.color}`} />
                <div className="p-5">
                  {course.isFree && (
                    <span className="inline-block rounded-full bg-green-900 text-green-300 px-2 py-0.5 text-xs font-bold mb-3">
                      FREE
                    </span>
                  )}
                  <h3 className="font-black group-hover:text-yellow-400 transition">{course.title}</h3>
                  <p className="mt-2 text-xs text-slate-400">{course.category} · {course.difficulty}</p>
                  <p className="mt-3 text-xs text-slate-500">
                    📚 {course.lessons.length} lessons · ⏱ {course.totalDuration}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs">
                    <span className="text-yellow-400">{course.rating}</span>
                    <span className="text-yellow-400">★</span>
                    <span className="text-slate-500">({course.reviewCount})</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 flex flex-col sm:flex-row gap-4">
          <Link
            href="/course-catalog"
            className="rounded-xl bg-yellow-500 px-8 py-4 font-black text-black text-center hover:bg-yellow-400 transition"
          >
            Browse All Courses
          </Link>
          <Link
            href="/my-courses"
            className="rounded-xl border border-slate-600 px-8 py-4 font-bold text-slate-300 text-center hover:bg-slate-800 transition"
          >
            My Learning Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
