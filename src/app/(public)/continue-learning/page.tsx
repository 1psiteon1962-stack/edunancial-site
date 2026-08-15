"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMemberProgress } from "@/components/member/useMemberProgress";
import { useAuth } from "@/lib/authContext";

export default function ContinueLearning() {
  const { user, loading: authLoading } = useAuth();
  const { progress, loading } = useMemberProgress();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, router, user]);

  if (authLoading || loading || !user) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-100"><p className="text-slate-500">Loading…</p></main>;
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl p-10">
        <h1 className="text-5xl font-bold text-slate-950">Continue Learning</h1>

        <div className="mt-10 rounded-xl bg-white p-8 shadow">
          <p className="text-lg text-slate-700">Resume the exact lesson most recently saved for each course. Progress is synced to your authenticated member account.</p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {progress.map((item) => (
              <div key={item.courseId} className="rounded-xl border border-slate-200 p-6">
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">{item.category}</p>
                <h2 className="mt-3 text-2xl font-bold text-slate-950">{item.title}</h2>
                <p className="mt-4 text-slate-700">{item.next_lesson_id ?? item.last_lesson_id ?? "Ready to begin"}</p>
                <p className="mt-2 text-sm text-slate-500">{item.completed_lessons_count} of {item.total_lessons} lessons complete</p>
                <Link href={item.continue_href} className="mt-4 inline-block rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">{item.completed ? "Review course" : "Continue learning"}</Link>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/dashboard" className="rounded-xl bg-slate-950 px-6 py-3 font-bold text-white">Back to Dashboard</Link>
            <Link href="/course-progress" className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-950">View Course Progress</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
