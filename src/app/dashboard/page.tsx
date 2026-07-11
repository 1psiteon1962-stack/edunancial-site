import Link from "next/link";

import { currentUser } from "@/lib/auth";
import {
  getAdaptiveLearningExperience,
  NORTH_AMERICA_TRACKS,
  TRACK_COLOR_STYLES,
  TRACK_SURFACE_STYLES,
  TRACK_TEXT_STYLES,
} from "@/lib/adaptive-learning";

const sidebarItems = ["Dashboard", "My Learning", "Assessments", "Certificates", "AI Financial Coach", "Books", "Progress"];

export const metadata = {
  title: "Member Dashboard | Edunancial",
  description: "Phase 1 member dashboard shell with adaptive learning status and next-step guidance.",
};

export default function DashboardPage() {
  const user = currentUser();
  const firstName = user?.firstName ?? "Member";
  const adaptiveLearning = getAdaptiveLearningExperience(user?.id ?? "guest-member");
  const recommendedTrack = adaptiveLearning.recommendedTrack;
  const selectedTrack = adaptiveLearning.studentProgress.tracks[recommendedTrack];
  const continueLearningHref = selectedTrack.nextLesson ? "/continue-learning" : "/courses";
  const learningProgress = Object.entries(adaptiveLearning.studentProgress.tracks).map(
    ([track, progress]) => ({
      track,
      label: NORTH_AMERICA_TRACKS[track as keyof typeof NORTH_AMERICA_TRACKS],
      level: progress.currentLevel,
      completionPercentage: progress.completionPercentage,
      status: progress.assessmentStatus,
      nextLesson: progress.nextLesson?.id ?? "Awaiting curriculum upload",
    }),
  );

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-yellow-400">Member Area</p>
              <h1 className="mt-2 text-2xl font-black sm:text-3xl">Welcome, {firstName}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Assessment mastery now drives independent RED, WHITE, and BLUE progression so newly
                imported curriculum can unlock the right next lesson automatically.
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-3 text-sm font-bold">
              <Link href="/" className="rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:text-white">
                Home
              </Link>
              <Link href="/courses" className="rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:text-white">
                Courses
              </Link>
              <Link href="/ai-coach" className="rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:text-white">
                AI Coach
              </Link>
            </nav>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={continueLearningHref}
              className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-black text-slate-950 hover:bg-yellow-300"
            >
              Continue Learning
            </Link>
            <Link
              href="/assessment/results"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              View Assessment Results
            </Link>
          </div>
        </header>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <aside className="w-full rounded-2xl border border-white/10 bg-slate-900/80 p-4 lg:w-64 lg:flex-none">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Navigation</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {sidebarItems.map((item) => (
                <li key={item} className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200">
                  {item}
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex-1 space-y-6">
            <section
              className={`rounded-2xl border p-5 sm:p-6 ${TRACK_SURFACE_STYLES[recommendedTrack]} ${
                recommendedTrack === "WHITE" ? "text-slate-950" : "text-white"
              }`}
            >
              <p className={`text-xs font-bold uppercase tracking-[0.35em] ${TRACK_TEXT_STYLES[recommendedTrack]}`}>
                Recommended Track
              </p>
              <h2 className="mt-3 text-2xl font-black">
                {recommendedTrack} · {NORTH_AMERICA_TRACKS[recommendedTrack]}
              </h2>
              <p className={`mt-3 text-sm leading-7 ${recommendedTrack === "WHITE" ? "text-slate-700" : "text-slate-200"}`}>
                Current level {selectedTrack.currentLevel}. {selectedTrack.assessmentStatus}. Next lesson:{" "}
                {selectedTrack.nextLesson?.id ?? "Awaiting curriculum upload"}.
              </p>
              <p className={`mt-2 text-sm ${recommendedTrack === "WHITE" ? "text-slate-700" : "text-slate-300"}`}>
                Unlocks stay gated by the configured mastery threshold of {adaptiveLearning.masteryThreshold}%.
              </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {adaptiveLearning.dashboardWidgets.map((widget) => (
                <article key={widget.id} className="min-h-36 rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">{widget.label}</p>
                  <h2 className="mt-4 text-lg font-black">{widget.value}</h2>
                </article>
              ))}
            </section>

            <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Adaptive Learning</p>
                  <h2 className="mt-2 text-xl font-black">Track-by-track progression</h2>
                </div>
                <Link href="/continue-learning" className="text-sm font-bold text-blue-300 hover:text-blue-200">
                  Open queue &rarr;
                </Link>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-3">
                {learningProgress.map((item) => (
                  <article key={item.track} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-200">
                      <span>
                        {item.track} · {item.level}
                      </span>
                      <span>{item.completionPercentage}%</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                    <div className="mt-4 h-2 rounded-full bg-slate-700">
                      <div
                        className={`h-2 rounded-full ${TRACK_COLOR_STYLES[item.track as keyof typeof TRACK_COLOR_STYLES]}`}
                        style={{ width: `${item.completionPercentage}%` }}
                      />
                    </div>
                    <p className="mt-4 text-sm text-slate-300">{item.status}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                      Next lesson: {item.nextLesson}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
