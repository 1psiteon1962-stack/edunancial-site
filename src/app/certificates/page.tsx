import Link from "next/link";
import { courseList, courses } from "@/data/course-platform";

export const metadata = {
  title: "Certificates | Edunancial",
};

// Mock completed courses — in production from auth/database
const completedCourseIds = new Set(["financial-foundations"]);

export default function CertificatesPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold text-sm">CERTIFICATES</p>
        <h1 className="mt-4 text-5xl font-black md:text-6xl">Earn Recognition</h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Complete every lesson and pass the final quiz to earn your certificate.
          Certificates are shareable and verifiable.
        </p>

        {/* Earned certificates */}
        {completedCourseIds.size > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black mb-8 text-green-400">🎓 Certificates Earned</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {courseList
                .filter((c) => completedCourseIds.has(c.id))
                .map((course) => (
                  <div
                    key={course.id}
                    className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-yellow-700 p-8"
                  >
                    <div className={`inline-block rounded-lg px-3 py-1 text-xs font-bold mb-4 ${
                      course.color.startsWith("bg-slate-2") ? "bg-slate-300 text-slate-900" : course.color
                    }`}>
                      {course.category}
                    </div>
                    <h2 className="text-2xl font-black">{course.title}</h2>
                    <p className="mt-2 text-slate-400 text-sm">Certificate of Completion</p>
                    <p className="mt-1 text-yellow-400 text-sm font-bold">✅ Completed</p>
                    <div className="mt-6 flex gap-3">
                      <button className="flex-1 rounded-xl bg-yellow-500 py-3 font-bold text-black hover:bg-yellow-400 transition">
                        Download PDF
                      </button>
                      <Link
                        href={`/courses/${course.id}`}
                        className="rounded-xl border border-slate-600 px-4 py-3 font-bold text-slate-300 hover:bg-slate-800 transition"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Available certificates */}
        <div className="mt-16">
          <h2 className="text-2xl font-black mb-8">Available Certificates</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courseList
              .filter((c) => !completedCourseIds.has(c.id))
              .map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col"
                >
                  <div className={`h-1 w-full rounded-full mb-4 ${
                    course.color.startsWith("bg-slate-2") ? "bg-slate-400" : course.color
                  }`} />
                  <h2 className="text-lg font-black">{course.title}</h2>
                  <p className="mt-2 text-slate-400 text-sm flex-1">
                    Complete {course.lessons.length} lessons to earn this certificate.
                  </p>
                  <div className="mt-6 space-y-3">
                    <div className="h-2 w-full rounded-full bg-slate-800">
                      <div className="h-2 rounded-full bg-slate-600" style={{ width: "0%" }} />
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href={`/courses/${course.id}`}
                        className="flex-1 rounded-xl bg-slate-800 border border-slate-600 py-2.5 text-center text-sm font-bold text-slate-300 hover:bg-slate-700 transition"
                      >
                        Start Course
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Verification note */}
        <div className="mt-16 rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center">
          <h3 className="text-xl font-black">Certificate Verification</h3>
          <p className="mt-3 text-slate-300 max-w-xl mx-auto">
            All Edunancial certificates include a unique verification code. Share with employers,
            partners, and networks to prove your financial competency.
          </p>
          <Link
            href="/my-certificates"
            className="mt-6 inline-block rounded-xl bg-yellow-500 px-8 py-4 font-black text-black hover:bg-yellow-400 transition"
          >
            View My Certificates
          </Link>
        </div>
      </section>
    </main>
  );
}
