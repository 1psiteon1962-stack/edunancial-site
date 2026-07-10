import type { AchievementCategory } from "@/lib/gamification/types";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/gamification/achievements";
import AchievementCard from "./AchievementCard";

type AchievementWithState = {
  definition: (typeof ACHIEVEMENT_DEFINITIONS)[number];
  state: { achievementId: string; earned: boolean; earnedAt?: string; progress?: number };
};

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  onboarding: "Getting Started",
  learning: "Learning",
  streaks: "Streaks",
  finance: "Finance",
  mastery: "Mastery",
  community: "Community",
};

interface Props {
  achievements: AchievementWithState[];
  /** Show a category filter bar. Default: true */
  showFilter?: boolean;
}

export default function AchievementGrid({ achievements, showFilter = true }: Props) {
  const earned = achievements.filter((a) => a.state.earned).length;
  const total = achievements.length;

  // Group by category
  const grouped = achievements.reduce<Record<string, AchievementWithState[]>>(
    (acc, item) => {
      const cat = item.definition.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {}
  );

  return (
    <section aria-label="Achievements">
      {/* Summary */}
      <div className="mb-8 flex items-center gap-6">
        <div>
          <p className="text-3xl font-black">
            {earned}
            <span className="text-slate-400 text-xl font-normal"> / {total}</span>
          </p>
          <p className="text-sm text-slate-400">Achievements Earned</p>
        </div>

        {/* Overall progress bar */}
        <div className="flex-1 max-w-xs">
          <div
            className="h-3 rounded-full bg-slate-700"
            role="progressbar"
            aria-valuenow={earned}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label={`${earned} of ${total} achievements earned`}
          >
            <div
              className="h-3 rounded-full bg-yellow-400 transition-all"
              style={{ width: total > 0 ? `${(earned / total) * 100}%` : "0%" }}
            />
          </div>
        </div>
      </div>

      {/* Category sections */}
      {(Object.entries(grouped) as [AchievementCategory, AchievementWithState[]][]).map(
        ([category, items]) => (
          <div key={category} className="mb-12">
            <h2 className="mb-6 text-xl font-bold uppercase tracking-widest text-yellow-400">
              {CATEGORY_LABELS[category] ?? category}
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <AchievementCard
                  key={item.definition.id}
                  definition={item.definition}
                  state={item.state}
                />
              ))}
            </div>
          </div>
        )
      )}
    </section>
  );
}
