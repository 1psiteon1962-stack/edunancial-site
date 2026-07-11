import Link from "next/link";

import {
  getAdaptiveLearningExperience,
  NORTH_AMERICA_TRACKS,
  TRACK_SURFACE_STYLES,
  TRACK_TEXT_STYLES,
} from "@/lib/adaptive-learning";

export const metadata = {
  title: "Assessment Results | Edunancial",
  description: "Your personalized Financial Competency Assessment results.",
};

export default function AssessmentResultsPage() {
  const adaptiveLearning = getAdaptiveLearningExperience();
  const overallScore = Math.round(
    adaptiveLearning.studentProgress.assessmentScores.reduce((total, result) => total + result.score, 0) /
      adaptiveLearning.studentProgress.assessmentScores.length,
  );
  const learningRoadmap = Object.entries(adaptiveLearning.studentProgress.tracks).map(([track, progress]) => ({
    track,
    title: progress.nextLesson?.title ?? `${track} curriculum queue`,
    detail:
      progress.nextLesson?.id ??
      `Awaiting imported lessons for ${NORTH_AMERICA_TRACKS[track as keyof typeof NORTH_AMERICA_TRACKS]}`,
    status: progress.assessmentStatus,
  }));

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="font-bold uppercase tracking-[0.45em] text-green-400">ASSESSMENT RESULTS</p>

        <h1 className="mt-8 text-7xl font-black">
          Your Financial
          <br />
          Competency Report
        </h1>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          Assessment results now connect directly to curriculum progression so North America learners can
          move through RED, WHITE, and BLUE tracks independently without adding curriculum content.
        </p>

        <div className="mt-20 rounded-2xl bg-gradient-to-r from-blue-700 via-green-600 to-blue-700 p-12 text-center">
          <p className="text-xl font-bold uppercase tracking-[0.4em]">OVERALL FINANCIAL COMPETENCY SCORE</p>
          <h2 className="mt-8 text-8xl font-black">{overallScore}</h2>
          <p className="mt-8 text-3xl font-bold">
            Mastery threshold: {adaptiveLearning.masteryThreshold}%
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {Object.entries(adaptiveLearning.studentProgress.tracks).map(([track, progress]) => {
            const latestResult = progress.assessmentResults.at(-1);
            const isWhite = track === "WHITE";

            return (
              <div
                key={track}
                className={`rounded-xl border p-10 ${TRACK_SURFACE_STYLES[track as keyof typeof TRACK_SURFACE_STYLES]} ${isWhite ? "text-slate-950" : "text-white"}`}
              >
                <h3 className="text-3xl font-black">{track}</h3>
                <p className={`mt-5 text-xl ${TRACK_TEXT_STYLES[track as keyof typeof TRACK_TEXT_STYLES]}`}>
                  {NORTH_AMERICA_TRACKS[track as keyof typeof NORTH_AMERICA_TRACKS]}
                </p>
                <p className="mt-8 text-5xl font-black">{latestResult?.score ?? 0}%</p>
                <p className="mt-4 text-lg">Current Level: {progress.currentLevel}</p>
                <p className="mt-2 text-sm">{progress.assessmentStatus}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-slate-900 p-10">
            <h2 className="text-4xl font-black">Framework Strengths</h2>
            <ul className="mt-10 space-y-5 text-xl text-slate-300">
              <li>✓ Assessment results store score, level, color, mastery threshold, and completion time</li>
              <li>✓ Each color progresses independently across L1 through L5</li>
              <li>✓ Dashboard widgets and course routing use the same progression model</li>
              <li>✓ Curriculum IDs are recognized automatically from imported registry data</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-900 p-10">
            <h2 className="text-4xl font-black">Current Opportunities</h2>
            <ul className="mt-10 space-y-5 text-xl text-slate-300">
              {learningRoadmap.map((item) => (
                <li key={item.track}>
                  • {item.track}: {item.status} — {item.detail}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 rounded-2xl bg-[#111827] p-10">
          <h2 className="text-4xl font-black">Personalized Learning Roadmap</h2>
          <p className="mt-8 text-xl leading-9 text-slate-300">
            Recommended next lessons are derived from the curriculum registry, which means newly imported
            lessons become available to the learning path manager without per-lesson programming.
          </p>

          <div className="mt-12 space-y-8">
            {learningRoadmap.map((item) => (
              <div key={item.track} className="rounded-xl bg-slate-900 p-8">
                <h3 className="text-2xl font-black">
                  {item.track} • {NORTH_AMERICA_TRACKS[item.track as keyof typeof NORTH_AMERICA_TRACKS]}
                </h3>
                <p className="mt-4 text-slate-300">{item.title}</p>
                <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 rounded-2xl border border-blue-600 bg-slate-900 p-10">
          <h2 className="text-4xl font-black">Student Progress Database Snapshot</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-700 p-6">
              <h3 className="text-2xl font-bold">Current Level</h3>
              <p className="mt-4 text-slate-300">{adaptiveLearning.studentProgress.currentLevel}</p>
            </div>
            <div className="rounded-xl border border-slate-700 p-6">
              <h3 className="text-2xl font-bold">Current Color</h3>
              <p className="mt-4 text-slate-300">{adaptiveLearning.studentProgress.currentColor}</p>
            </div>
            <div className="rounded-xl border border-slate-700 p-6">
              <h3 className="text-2xl font-bold">Completion</h3>
              <p className="mt-4 text-slate-300">{adaptiveLearning.studentProgress.completionPercentage}%</p>
            </div>
            <div className="rounded-xl border border-slate-700 p-6">
              <h3 className="text-2xl font-bold">Certificates Earned</h3>
              <p className="mt-4 text-slate-300">{adaptiveLearning.studentProgress.certificatesEarned.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap justify-center gap-6">
          <Link
            href="/continue-learning"
            className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
          >
            Continue Learning
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
          >
            Open Dashboard
          </Link>
          <Link
            href="/courses"
            className="rounded-xl border border-green-500 px-10 py-5 text-xl font-bold hover:bg-green-600"
          >
            View Courses
          </Link>
        </div>
      </section>
    </main>
  );
}
