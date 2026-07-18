"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { courseList } from "@/data/course-platform";

const completedCourseIds = new Set(["financial-foundations"]);

export default function CertificatesPageClient() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{t("certificates.label")}</p>
        <h1 className="mt-4 text-5xl font-black md:text-6xl">{t("certificates.title")}</h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">{t("certificates.description")}</p>

        {completedCourseIds.size > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-black text-green-400">🎓 {t("certificates.earnedHeading")}</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {courseList.filter((course) => completedCourseIds.has(course.id)).map((course) => (
                <div key={course.id} className="rounded-2xl border border-yellow-700 bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                  <div className={`mb-4 inline-block rounded-lg px-3 py-1 text-xs font-bold ${course.color.startsWith("bg-slate-2") ? "bg-slate-300 text-slate-900" : course.color}`}>
                    {course.category}
                  </div>
                  <h2 className="text-2xl font-black">{course.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">{t("certificates.earnedLabel")}</p>
                  <p className="mt-1 text-sm font-bold text-yellow-400">✅ {t("certificates.completedLabel")}</p>
                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 rounded-xl bg-yellow-500 py-3 font-bold text-black transition hover:bg-yellow-400">
                      {t("certificates.downloadLabel")}
                    </button>
                    <Link href={`/courses/${course.id}`} className="rounded-xl border border-slate-600 px-4 py-3 font-bold text-slate-300 transition hover:bg-slate-800">
                      {t("certificates.reviewLabel")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <h2 className="mb-8 text-2xl font-black">{t("certificates.availableHeading")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courseList.filter((course) => !completedCourseIds.has(course.id)).map((course) => (
              <div key={course.id} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className={`mb-4 h-1 w-full rounded-full ${course.color.startsWith("bg-slate-2") ? "bg-slate-400" : course.color}`} />
                <h2 className="text-lg font-black">{course.title}</h2>
                <p className="mt-2 flex-1 text-sm text-slate-400">{t("certificates.availableTemplate", { count: course.lessons.length })}</p>
                <div className="mt-6 space-y-3">
                  <div className="h-2 w-full rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-slate-600" style={{ width: "0%" }} />
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/courses/${course.id}`} className="flex-1 rounded-xl border border-slate-600 bg-slate-800 py-2.5 text-center text-sm font-bold text-slate-300 transition hover:bg-slate-700">
                      {t("certificates.startLabel")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h3 className="text-xl font-black">{t("certificates.verificationHeading")}</h3>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">{t("certificates.verificationBody")}</p>
          <Link href="/my-certificates" className="mt-6 inline-block rounded-xl bg-yellow-500 px-8 py-4 font-black text-black transition hover:bg-yellow-400">
            {t("certificates.myCertificatesLabel")}
          </Link>
        </div>
      </section>
    </main>
  );
}
