import type { Metadata } from "next";
import AICoachLayout from "@/components/ai-coach/AICoachLayout";
import GoalCard from "@/components/ai-coach/GoalCard";
import { getGoals, calculateAllGoalsProgress, GOAL_CATEGORY_ICONS, GOAL_CATEGORY_LABELS } from "@/lib/ai-coach/goal-engine";
import type { GoalCategory } from "@/types/ai-coach";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Financial Goals | AI Coach | Edunancial",
  description:
    "Track savings, debt payoff, investment, retirement, home ownership, and custom financial goals with your Edunancial AI Coach.",
};

const GOAL_CATEGORIES: GoalCategory[] = [
  "savings",
  "debt",
  "investment",
  "retirement",
  "homeOwnership",
  "businessOwnership",
  "custom",
];

export default async function GoalsPage() {
  const goals = await getGoals("demo");
  const allProgress = calculateAllGoalsProgress(goals);

  const totalGoals = goals.length;
  const onTrack = allProgress.filter((gp) => gp.isOnTrack && gp.percentComplete < 100).length;
  const completed = allProgress.filter((gp) => gp.percentComplete >= 100).length;

  return (
    <AICoachLayout activeHref="/ai-coach/goals">
      {/* Header */}
      <section aria-labelledby="goals-page-heading">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Financial Goals
        </p>
        <h1 id="goals-page-heading" className="mt-3 text-5xl font-black">
          Your Financial Goals
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Set, track, and achieve your financial goals across savings, debt payoff, investing, retirement, home ownership, and more.
        </p>
      </section>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-900 p-5 text-center">
          <p className="text-4xl font-black text-blue-400">{totalGoals}</p>
          <p className="mt-1 text-sm text-slate-400">Total Goals</p>
        </div>
        <div className="rounded-xl bg-slate-900 p-5 text-center">
          <p className="text-4xl font-black text-green-400">{onTrack}</p>
          <p className="mt-1 text-sm text-slate-400">On Track</p>
        </div>
        <div className="rounded-xl bg-slate-900 p-5 text-center">
          <p className="text-4xl font-black text-yellow-400">{completed}</p>
          <p className="mt-1 text-sm text-slate-400">Completed</p>
        </div>
      </div>

      {/* Goal type quick-add */}
      <div className="mt-8 rounded-2xl bg-slate-900 p-6">
        <h2 className="text-xl font-black">Start a New Goal</h2>
        <p className="mt-2 text-sm text-slate-400">
          Choose a goal type to begin tracking your progress.
        </p>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7" aria-label="Goal categories">
          {GOAL_CATEGORIES.map((cat) => (
            <li key={cat}>
              <button
                type="button"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-center transition hover:border-blue-500 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label={`Create ${GOAL_CATEGORY_LABELS[cat]} goal`}
              >
                <span className="block text-2xl" aria-hidden="true">
                  {GOAL_CATEGORY_ICONS[cat]}
                </span>
                <span className="mt-2 block text-xs font-bold text-slate-300">
                  {GOAL_CATEGORY_LABELS[cat]}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-slate-500">
          * Goal creation form requires authentication. Connect your account to save goals.
        </p>
      </div>

      {/* Active Goals */}
      <div className="mt-10">
        <h2 className="mb-6 text-2xl font-black">Active Goals</h2>
        {allProgress.length === 0 ? (
          <div className="rounded-xl bg-slate-900 p-8 text-center text-slate-400">
            <p className="text-lg">No goals yet. Create your first financial goal above.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allProgress.map((gp) => (
              <GoalCard key={gp.goal.id} goalProgress={gp} showDetails />
            ))}
          </div>
        )}
      </div>

      {/* Goal categories overview */}
      <div className="mt-12 rounded-2xl bg-slate-900 p-8">
        <h2 className="text-2xl font-black">Goal Types</h2>
        <p className="mt-2 text-slate-400">
          Edunancial supports 7 financial goal categories to cover your entire wealth journey.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GOAL_CATEGORIES.map((cat) => (
            <div
              key={cat}
              className="rounded-xl border border-slate-700 bg-slate-800 p-5"
            >
              <span className="text-2xl" aria-hidden="true">
                {GOAL_CATEGORY_ICONS[cat]}
              </span>
              <h3 className="mt-3 font-bold">{GOAL_CATEGORY_LABELS[cat]}</h3>
              <p className="mt-1 text-sm text-slate-400">
                {getCategoryDescription(cat)}
              </p>
            </div>
          ))}
        </div>
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

function getCategoryDescription(cat: GoalCategory): string {
  const descriptions: Record<GoalCategory, string> = {
    savings: "Build emergency funds, sinking funds, and general savings targets.",
    debt: "Eliminate credit cards, student loans, car payments, and other liabilities.",
    investment: "Grow a portfolio through stocks, ETFs, real estate, and alternatives.",
    retirement: "Build your RRSP, 401(k), or other retirement vehicles.",
    homeOwnership: "Save for a down payment and plan your home purchase.",
    businessOwnership: "Fund your business launch, growth, or acquisition.",
    custom: "Any other goal that matters to your financial journey.",
  };
  return descriptions[cat];
}
