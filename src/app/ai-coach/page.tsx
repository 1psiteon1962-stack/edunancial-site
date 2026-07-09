import type { Metadata } from "next";
import AICoachLayout from "@/components/ai-coach/AICoachLayout";
import PersonalizedWelcome from "@/components/ai-coach/PersonalizedWelcome";
import CompetencyScoreWidget from "@/components/ai-coach/CompetencyScoreWidget";
import GoalCard from "@/components/ai-coach/GoalCard";
import DailyRecommendations from "@/components/ai-coach/DailyRecommendations";
import NextActionsWidget from "@/components/ai-coach/NextActionsWidget";
import LearningProgressWidget from "@/components/ai-coach/LearningProgressWidget";
import NotificationCenter from "@/components/ai-coach/NotificationCenter";
import AchievementWidget from "@/components/ai-coach/AchievementWidget";
import { getAICoachDashboardData } from "@/lib/ai-coach/coach-data-service";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Financial Coach | Edunancial",
  description:
    "Your personalized AI Financial Coach. Track goals, improve competency, and receive daily recommendations tailored to your financial journey.",
};

export default async function AICoachPage() {
  const data = await getAICoachDashboardData("demo");

  return (
    <AICoachLayout activeHref="/ai-coach">
      {/* Welcome */}
      <PersonalizedWelcome
        memberName={data.memberName}
        membershipLevel={data.membershipLevel}
        competencyScore={data.competencyScores?.overall ?? null}
        assessmentCompleted={data.assessmentCompleted}
        learningStreak={data.learningHistory?.currentStreak ?? 0}
      />

      {/* Main grid */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Next Actions */}
          <NextActionsWidget actions={data.nextActions} />

          {/* Daily Recommendations */}
          <DailyRecommendations
            recommendations={data.topRecommendations}
            compact
          />

          {/* Goals summary */}
          <section aria-labelledby="goals-summary-heading">
            <div className="mb-5 flex items-center justify-between">
              <h2 id="goals-summary-heading" className="text-2xl font-black">
                Financial Goals
              </h2>
              <Link
                href="/ai-coach/goals"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Manage Goals →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {data.goals.slice(0, 4).map((gp) => (
                <GoalCard key={gp.goal.id} goalProgress={gp} />
              ))}
            </div>
            {data.goals.length === 0 && (
              <div className="rounded-xl bg-slate-900 p-6 text-center text-slate-400">
                <p>No goals yet. Start building your financial future.</p>
                <Link
                  href="/ai-coach/goals"
                  className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Create a Goal →
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Competency Score */}
          {data.competencyScores && (
            <CompetencyScoreWidget
              scores={data.competencyScores}
              level={data.competencyLevel}
            />
          )}

          {/* Learning Progress */}
          {data.learningHistory && (
            <LearningProgressWidget history={data.learningHistory} />
          )}

          {/* Notifications */}
          <NotificationCenter
            notifications={data.recentNotifications}
            compact
          />

          {/* Achievements */}
          <AchievementWidget achievements={data.achievements} compact />
        </div>
      </div>
    </AICoachLayout>
  );
}
