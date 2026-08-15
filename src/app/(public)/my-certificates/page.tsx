"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useMemberProgress } from "@/components/member/useMemberProgress";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { useAuth } from "@/lib/authContext";

export default function MyCertificatesPage() {
  const { t } = useInternationalPreferences();
  const { user, loading: authLoading } = useAuth();
  const { progress, loading } = useMemberProgress();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, router, user]);

  if (authLoading || loading || !user) {
    return <main className="flex min-h-screen items-center justify-center bg-[#08101f] text-white"><p className="text-slate-400">Loading…</p></main>;
  }

  const completedCourses = progress.filter((course) => course.completed);

  if (completedCourses.length === 0) {
    return (
      <main className="min-h-screen bg-[#08101f] text-white">
        <section className="mx-auto max-w-7xl px-6 py-20 text-center">
          <span className="text-6xl">🎓</span>
          <h1 className="mt-6 text-4xl font-black">{t("myCertificates.noCertificatesYet")}</h1>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">{t("myCertificates.completeCourse")}</p>
          <Link href="/course-catalog" className="mt-8 inline-block rounded-xl bg-yellow-500 px-8 py-4 font-black text-black transition hover:bg-yellow-400">{t("myCertificates.startCourse")}</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{t("myCertificates.label")}</p>
        <h1 className="mt-4 text-5xl font-black">{t("myCertificates.certificatesEarned")}</h1>
        <p className="mt-4 text-slate-300">{completedCourses.length} completed course{completedCourses.length === 1 ? "" : "s"}.</p>

        <div className="mt-12 space-y-4">
          {completedCourses.map((course) => (
            <div key={course.courseId} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <button className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-slate-800" onClick={() => setExpandedId(expandedId === course.courseId ? null : course.courseId)}>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <p className="font-black">{course.title}</p>
                    <p className="text-sm text-slate-400">{t("myCertificates.certificateOfCompletion")} · {course.category}</p>
                  </div>
                </div>
                <span className="text-slate-400">{expandedId === course.courseId ? "▲" : "▼"}</span>
              </button>
              {expandedId === course.courseId ? (
                <div className="px-6 pb-8 text-sm text-slate-300">
                  <div className="rounded-[2rem] border-2 border-yellow-700 bg-gradient-to-br from-slate-900 via-[#0d1a30] to-slate-900 p-10 text-center shadow-2xl shadow-black/30">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-yellow-400">EDUNANCIAL</p>
                    <p className="mt-2 text-sm text-slate-400">{t("myCertificates.certificateOfCompletion")}</p>
                    <p className="mt-8 text-sm text-slate-400">{t("myCertificates.thisCertifiesThat")}</p>
                    <p className="mt-2 text-3xl font-black">{user.firstName} {user.lastName}</p>
                    <p className="mt-4 text-sm text-slate-400">{t("myCertificates.hasSuccessfullyCompleted")}</p>
                    <p className="mt-2 text-2xl font-black text-yellow-400">{course.title}</p>
                    <p className="mt-3 text-sm text-slate-300">Completed {course.completed_at ? new Date(course.completed_at).toLocaleDateString() : "recently"}.</p>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
