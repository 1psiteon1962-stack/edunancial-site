import type { Metadata } from "next";
import AICoachLayout from "@/components/ai-coach/AICoachLayout";
import LearningProgressWidget from "@/components/ai-coach/LearningProgressWidget";
import {
  getAdaptiveLearningPaths,
  getDemoLearningHistory,
  CONTENT_TYPE_ICONS,
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
} from "@/lib/ai-coach/learning-engine";
import { DEMO_SCORES } from "@/lib/ai-coach/coach-data-service";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personalized Learning | AI Coach | Edunancial",
  description:
    "Adaptive learning paths and personalized content recommendations across courses, books, articles, and videos — tailored to your Financial Competency scores.",
};

export default function LearningPage() {
  const history = getDemoLearningHistory("demo");
  const completedIds = history.completedItems.map((i) => i.itemId);
  const paths = getAdaptiveLearningPaths(DEMO_SCORES, completedIds);

  return (
    <AICoachLayout activeHref="/ai-coach/learning">
      {/* Header */}
      <section aria-labelledby="learning-page-heading">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Personalized Learning Engine
        </p>
        <h1 id="learning-page-heading" className="mt-3 text-5xl font-black">
          Your Adaptive Learning Paths
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Learning paths are automatically tailored to your competency scores. The lowest-scoring areas are prioritized, and difficulty adapts as you progress.
        </p>
      </section>

      {/* Progress overview */}
      <div className="mt-8">
        <LearningProgressWidget history={history} />
      </div>

      {/* How adaptive learning works */}
      <div className="mt-8 rounded-2xl bg-slate-800 p-6">
        <h2 className="text-lg font-black">How Adaptive Learning Works</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-900 p-4">
            <p className="text-2xl" aria-hidden="true">🎯</p>
            <h3 className="mt-2 font-bold">Score-Driven Priority</h3>
            <p className="mt-1 text-sm text-slate-400">
              Paths for your weakest areas are shown first, maximizing competency gain.
            </p>
          </div>
          <div className="rounded-xl bg-slate-900 p-4">
            <p className="text-2xl" aria-hidden="true">📈</p>
            <h3 className="mt-2 font-bold">Difficulty Progression</h3>
            <p className="mt-1 text-sm text-slate-400">
              Content difficulty (Beginner → Expert) auto-adjusts based on your current score.
            </p>
          </div>
          <div className="rounded-xl bg-slate-900 p-4">
            <p className="text-2xl" aria-hidden="true">🔓</p>
            <h3 className="mt-2 font-bold">Sequential Unlocking</h3>
            <p className="mt-1 text-sm text-slate-400">
              Complete each step to unlock the next, ensuring a logical skill progression.
            </p>
          </div>
        </div>
      </div>

      {/* Learning Paths */}
      <div className="mt-10 space-y-10">
        {paths.map((path) => {
          const completedSteps = path.steps.filter((s) => s.isCompleted).length;
          const totalSteps = path.steps.length;
          const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

          return (
            <article
              key={path.id}
              className="rounded-2xl bg-slate-900 p-6"
              aria-labelledby={`path-${path.id}-title`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 id={`path-${path.id}-title`} className="text-2xl font-black">
                    {path.title}
                  </h2>
                  <p className="mt-1 text-slate-400">{path.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">
                    ⏱ ~{path.estimatedHours}h total
                  </p>
                  <p className="text-sm font-bold text-yellow-400">
                    🏆 {path.competencyAward}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-5">
                <div className="mb-1 flex justify-between text-sm text-slate-400">
                  <span>{completedSteps} / {totalSteps} completed</span>
                  <span>{progressPct}%</span>
                </div>
                <div
                  className="h-2 rounded-full bg-slate-700"
                  role="progressbar"
                  aria-valuenow={progressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${path.title}: ${progressPct}% complete`}
                >
                  <div
                    className="h-2 rounded-full bg-green-500 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Steps */}
              <ol className="mt-6 space-y-3">
                {path.steps.map((step) => {
                  const icon = CONTENT_TYPE_ICONS[step.item.type] ?? "📄";
                  const diffColor = DIFFICULTY_COLORS[step.item.difficulty];
                  const diffLabel = DIFFICULTY_LABELS[step.item.difficulty];

                  return (
                    <li
                      key={step.item.id}
                      className={`flex items-center gap-4 rounded-xl px-5 py-4 ${
                        step.isCompleted
                          ? "bg-green-900/20 border border-green-700/40"
                          : step.isUnlocked
                          ? "bg-slate-800"
                          : "bg-slate-800/50 opacity-50"
                      }`}
                      aria-label={`Step ${step.order}: ${step.item.title}${step.isCompleted ? " — completed" : step.isUnlocked ? " — available" : " — locked"}`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                          step.isCompleted
                            ? "bg-green-500 text-white"
                            : step.isUnlocked
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 text-slate-400"
                        }`}
                        aria-hidden="true"
                      >
                        {step.isCompleted ? "✓" : step.order}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span aria-hidden="true">{icon}</span>
                          <span className="font-bold">{step.item.title}</span>
                          <span className={`text-xs font-bold ${diffColor}`}>
                            {diffLabel}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-400 truncate">
                          {step.item.description}
                        </p>
                      </div>

                      <div className="text-right text-xs text-slate-400">
                        <p>
                          {step.item.estimatedMinutes >= 60
                            ? `${Math.round(step.item.estimatedMinutes / 60)}h`
                            : `${step.item.estimatedMinutes}m`}
                        </p>
                        {step.item.isFree && (
                          <p className="font-bold text-green-400">Free</p>
                        )}
                      </div>

                      {step.isUnlocked && !step.isCompleted && (
                        <Link
                          href={step.item.url}
                          className="ml-2 shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          Start
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </article>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/ai-coach"
          className="rounded-xl border border-slate-600 px-6 py-3 font-bold text-slate-300 hover:border-white hover:text-white"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </AICoachLayout>
  );
}
