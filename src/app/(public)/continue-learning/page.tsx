import Link from "next/link";

import { getAdaptiveLearningExperience, NORTH_AMERICA_TRACKS } from "@/lib/adaptive-learning";

export default function ContinueLearning() {
  const adaptiveLearning = getAdaptiveLearningExperience();
  const queue = Object.entries(adaptiveLearning.studentProgress.tracks).map(([track, progress]) => ({
    track,
    title: progress.nextLesson?.title ?? `${track} curriculum queue`,
    detail: progress.nextLesson?.id ?? "Awaiting curriculum upload",
    status: progress.assessmentStatus,
  }));

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl p-10">
        <h1 className="text-5xl font-bold text-slate-950">Continue Learning</h1>

        <div className="mt-10 rounded-xl bg-white p-8 shadow">
          <p className="text-lg text-slate-700">
            Resume the next unlocked lesson in each adaptive track. Lesson availability stays gated by
            the configurable mastery threshold of {adaptiveLearning.masteryThreshold}%.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {queue.map((item) => (
              <div key={item.track} className="rounded-xl border border-slate-200 p-6">
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">{item.track}</p>
                <h2 className="mt-3 text-2xl font-bold text-slate-950">
                  {NORTH_AMERICA_TRACKS[item.track as keyof typeof NORTH_AMERICA_TRACKS]}
                </h2>
                <p className="mt-4 text-slate-700">{item.title}</p>
                <p className="mt-2 text-sm text-slate-500">{item.detail}</p>
                <p className="mt-4 text-sm text-slate-500">{item.status}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/dashboard" className="rounded-xl bg-slate-950 px-6 py-3 font-bold text-white">
              Back to Dashboard
            </Link>
            <Link href="/assessment/results" className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-950">
              Review Assessment Results
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
