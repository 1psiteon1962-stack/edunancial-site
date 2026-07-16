"use client";

import Link from "next/link";
import { useState } from "react";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { courseList } from "@/data/course-platform";

const completedCourseIds = ["financial-foundations"];
const completedCourses = courseList.filter((c) => completedCourseIds.includes(c.id));

function earnedCountLabel(t: (key: string, values?: Record<string, string | number>) => string, count: number) {
  return count === 1
    ? t("myCertificates.earnedCount_one", { count })
    : t("myCertificates.earnedCount_other", { count });
}

function CertificateCard({ courseId }: { courseId: string }) {
  const { t } = useInternationalPreferences();
  const course = courseList.find((c) => c.id === courseId);

  if (!course) {
    return null;
  }

  const issueDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
  const memberName = t("myCertificates.memberName");
  const certificateId = `EDU-${course.id.toUpperCase().slice(0, 6)}-2026`;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border-2 border-yellow-700 bg-gradient-to-br from-slate-900 via-[#0d1a30] to-slate-900 p-10 text-center shadow-2xl shadow-black/30">
      <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center opacity-5">
        <span className="text-[20rem] font-black leading-none">{course.title[0]}</span>
      </div>

      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">EDUNANCIAL</p>
        <p className="mt-2 text-sm text-slate-400">{t("myCertificates.certificateOfCompletion")}</p>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-yellow-700 to-transparent" />

        <p className="text-sm text-slate-400">{t("myCertificates.thisCertifiesThat")}</p>
        <p className="mt-2 text-3xl font-black">{memberName}</p>

        <p className="mt-4 text-sm text-slate-400">{t("myCertificates.hasSuccessfullyCompleted")}</p>
        <p className="mt-2 text-2xl font-black text-yellow-400">{course.title}</p>
        <p className="mt-2 text-sm text-slate-300">{course.subtitle}</p>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-yellow-700 to-transparent" />

        <div className="grid gap-4 text-left text-xs text-slate-400 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
          <div>
            <p className="font-bold text-slate-200">{t("myCertificates.memberNameLabel")}</p>
            <p>{memberName}</p>
          </div>
          <div>
            <p className="font-bold text-slate-200">{t("myCertificates.course")}</p>
            <p>{course.title}</p>
          </div>
          <div>
            <p className="font-bold text-slate-200">{t("myCertificates.completionDate")}</p>
            <p>{issueDate}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="font-bold text-slate-200">{t("myCertificates.qrVerification")}</p>
            <div className="mx-auto mt-3 grid w-20 grid-cols-4 gap-1">
              {[1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1].map((cell, index) => (
                <span key={index} className={`h-4 w-4 rounded-sm ${cell ? "bg-white" : "bg-slate-700"}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-left text-xs text-slate-400 md:grid-cols-2">
          <div>
            <p className="font-bold text-slate-200">{t("myCertificates.certificateId")}</p>
            <p className="font-mono">{certificateId}</p>
          </div>
          <div>
            <p className="font-bold text-slate-200">{t("myCertificates.category")}</p>
            <p>{course.category}</p>
          </div>
        </div>

        <p className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-xs leading-6 text-slate-300">
          {t("myCertificates.disclaimer")}
        </p>
      </div>
    </div>
  );
}

export default function MyCertificatesPage() {
  const { t } = useInternationalPreferences();
  const [expandedId, setExpandedId] = useState<string | null>(completedCourseIds[0] ?? null);

  if (completedCourses.length === 0) {
    return (
      <main className="min-h-screen bg-[#08101f] text-white">
        <section className="mx-auto max-w-7xl px-6 py-20 text-center">
          <span className="text-6xl">🎓</span>
          <h1 className="mt-6 text-4xl font-black">{t("myCertificates.noCertificatesYet")}</h1>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">{t("myCertificates.completeCourse")}</p>
          <Link
            href="/course-catalog"
            className="mt-8 inline-block rounded-xl bg-yellow-500 px-8 py-4 font-black text-black transition hover:bg-yellow-400"
          >
            {t("myCertificates.startCourse")}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{t("myCertificates.label")}</p>
        <h1 className="mt-4 text-5xl font-black">{t("myCertificates.certificatesEarned")}</h1>
        <p className="mt-4 text-slate-300">{earnedCountLabel(t, completedCourses.length)}</p>

        <div className="mt-12 space-y-4">
          {completedCourses.map((course) => (
            <div key={course.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <button
                className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-slate-800"
                onClick={() => setExpandedId(expandedId === course.id ? null : course.id)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <p className="font-black">{course.title}</p>
                    <p className="text-sm text-slate-400">
                      {t("myCertificates.certificateOfCompletion")} · {course.category}
                    </p>
                  </div>
                </div>
                <span className="text-slate-400">{expandedId === course.id ? "▲" : "▼"}</span>
              </button>

              {expandedId === course.id && (
                <div className="px-6 pb-8">
                  <CertificateCard courseId={course.id} />
                  <div className="mt-6 flex justify-center gap-4">
                    <button className="rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black transition hover:bg-yellow-400">
                      {t("myCertificates.downloadPdf")}
                    </button>
                    <button className="rounded-xl border border-slate-600 px-6 py-3 font-bold text-slate-300 transition hover:bg-slate-800">
                      {t("myCertificates.copyVerifyLink")}
                    </button>
                    <Link
                      href={`/courses/${course.id}`}
                      className="rounded-xl border border-slate-600 px-6 py-3 font-bold text-slate-300 transition hover:bg-slate-800"
                    >
                      {t("myCertificates.reviewCourse")}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link href="/certificates" className="text-sm font-bold text-yellow-400 hover:text-yellow-300">
            {t("myCertificates.viewAll")}
          </Link>
        </div>
      </section>
    </main>
  );
}
