import type { UserStreaks } from "@/lib/gamification/types";
import { weeklyActiveCount, monthlyActiveCount } from "@/lib/gamification/streakEngine";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  streaks: UserStreaks;
}

export default function StreakWidget({ streaks }: Props) {
  const weeklyCount = weeklyActiveCount(streaks);
  const monthlyCount = monthlyActiveCount(streaks);

  return (
    <section aria-label="Learning streaks" className="rounded-2xl bg-slate-900 p-6 space-y-8">
      <h2 className="text-2xl font-black">Learning Streaks</h2>

      {/* Key stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBox
          label="Current Streak"
          value={`${streaks.currentStreak}d`}
          icon="🔥"
          highlight={streaks.currentStreak >= 7}
        />
        <StatBox
          label="Longest Streak"
          value={`${streaks.longestStreak}d`}
          icon="🏆"
          highlight={false}
        />
        <StatBox
          label="This Week"
          value={`${weeklyCount}/7`}
          icon="📅"
          highlight={weeklyCount === 7}
        />
        <StatBox
          label="This Month"
          value={`${monthlyCount}d`}
          icon="📆"
          highlight={false}
        />
      </div>

      {/* Weekly heatmap */}
      <div>
        <p className="mb-3 text-sm font-semibold text-slate-400 uppercase tracking-wider">
          This Week
        </p>
        <div
          className="flex gap-2"
          role="list"
          aria-label="Weekly activity"
        >
          {streaks.weeklyActivity.map((active, i) => (
            <div
              key={DAY_LABELS[i]}
              role="listitem"
              className="flex flex-1 flex-col items-center gap-1"
            >
              <div
                aria-label={`${DAY_LABELS[i]}: ${active ? "Active" : "Inactive"}`}
                className={[
                  "h-8 w-full rounded-md transition-colors",
                  active ? "bg-green-500" : "bg-slate-700",
                ].join(" ")}
              />
              <span className="text-xs text-slate-500">{DAY_LABELS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly heatmap */}
      {streaks.monthlyActivity.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-400 uppercase tracking-wider">
            This Month
          </p>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
            role="list"
            aria-label="Monthly activity"
          >
            {streaks.monthlyActivity.map((active, i) => (
              <div
                key={i}
                role="listitem"
                aria-label={`Day ${i + 1}: ${active ? "Active" : "Inactive"}`}
                title={`Day ${i + 1}`}
                className={[
                  "aspect-square rounded transition-colors",
                  active ? "bg-green-500" : "bg-slate-700",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      )}

      {/* Motivational message */}
      <p className="text-sm text-slate-400 italic">
        {streaks.currentStreak === 0
          ? "Start learning today to build your streak! 🚀"
          : streaks.currentStreak >= 30
          ? "Incredible consistency! You're unstoppable. 🌟"
          : streaks.currentStreak >= 7
          ? "Amazing streak! Keep the momentum going. 🔥"
          : "Great start! Keep coming back every day. 💪"}
      </p>
    </section>
  );
}

function StatBox({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon: string;
  highlight: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl p-4 text-center",
        highlight ? "bg-green-900/60 ring-1 ring-green-500" : "bg-slate-800",
      ].join(" ")}
    >
      <div className="text-2xl" aria-hidden="true">{icon}</div>
      <p className="mt-1 text-xl font-black">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}
