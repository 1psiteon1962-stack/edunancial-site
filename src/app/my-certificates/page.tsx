"use client";

import Link from "next/link";
import { courseList } from "@/data/course-platform";
import { useState } from "react";

// Mock completed courses
const completedCourseIds = ["financial-foundations"];
const completedCourses = courseList.filter((c) => completedCourseIds.includes(c.id));

function CertificateCard({ courseId }: { courseId: string }) {
  const course = courseList.find((c) => c.id === courseId);
  if (!course) return null;
  const issueDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="rounded-2xl border-2 border-yellow-700 bg-gradient-to-br from-slate-900 via-[#0d1a30] to-slate-900 p-10 text-center relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-center">
        <span className="text-[20rem] font-black leading-none">
          {course.title[0]}
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">EDUNANCIAL</p>
        <p className="mt-2 text-sm text-slate-400">Certificate of Completion</p>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-yellow-700 to-transparent" />

        <p className="text-sm text-slate-400">This certifies that</p>
        <p className="mt-2 text-3xl font-black">Your Name</p>

        <p className="mt-4 text-sm text-slate-400">has successfully completed</p>
        <p className="mt-2 text-2xl font-black text-yellow-400">{course.title}</p>
        <p className="mt-2 text-slate-300 text-sm">{course.subtitle}</p>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-yellow-700 to-transparent" />

        <div className="flex justify-between text-xs text-slate-400">
          <div>
            <p className="font-bold text-slate-200">Date Issued</p>
            <p>{issueDate}</p>
          </div>
          <div>
            <p className="font-bold text-slate-200">Credential ID</p>
            <p className="font-mono">EDU-{course.id.toUpperCase().slice(0, 6)}-2024</p>
          </div>
          <div>
            <p className="font-bold text-slate-200">Category</p>
            <p>{course.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyCertificatesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(
    completedCourseIds[0] ?? null
  );

  if (completedCourses.length === 0) {
    return (
      <main className="min-h-screen bg-[#08101f] text-white">
        <section className="mx-auto max-w-7xl px-6 py-20 text-center">
          <span className="text-6xl">🎓</span>
          <h1 className="mt-6 text-4xl font-black">No Certificates Yet</h1>
          <p className="mt-4 text-slate-300 max-w-lg mx-auto">
            Complete a course and pass the final quiz to earn your certificate.
          </p>
          <Link
            href="/course-catalog"
            className="mt-8 inline-block rounded-xl bg-yellow-500 px-8 py-4 font-black text-black hover:bg-yellow-400 transition"
          >
            Start a Course
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold text-sm">MY CERTIFICATES</p>
        <h1 className="mt-4 text-5xl font-black">Certificates Earned</h1>
        <p className="mt-4 text-slate-300">
          {completedCourses.length} certificate{completedCourses.length !== 1 ? "s" : ""} earned.
        </p>

        {/* Certificate list */}
        <div className="mt-12 space-y-4">
          {completedCourses.map((course) => (
            <div key={course.id} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-800 transition"
                onClick={() => setExpandedId(expandedId === course.id ? null : course.id)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <p className="font-black">{course.title}</p>
                    <p className="text-sm text-slate-400">Certificate of Completion · {course.category}</p>
                  </div>
                </div>
                <span className="text-slate-400">{expandedId === course.id ? "▲" : "▼"}</span>
              </button>

              {expandedId === course.id && (
                <div className="px-6 pb-8">
                  <CertificateCard courseId={course.id} />
                  <div className="mt-6 flex gap-4 justify-center">
                    <button className="rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black hover:bg-yellow-400 transition">
                      📥 Download PDF
                    </button>
                    <button className="rounded-xl border border-slate-600 px-6 py-3 font-bold text-slate-300 hover:bg-slate-800 transition">
                      🔗 Copy Verify Link
                    </button>
                    <Link
                      href={`/courses/${course.id}`}
                      className="rounded-xl border border-slate-600 px-6 py-3 font-bold text-slate-300 hover:bg-slate-800 transition"
                    >
                      Review Course
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link href="/certificates" className="text-yellow-400 hover:text-yellow-300 text-sm font-bold">
            View All Available Certificates →
          </Link>
        </div>
      </section>
    </main>
  );
}
