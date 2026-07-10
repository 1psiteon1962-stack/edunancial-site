import type { AchievementDefinition, UserAchievement, AchievementTier } from "@/lib/gamification/types";

const TIER_COLORS: Record<AchievementTier, string> = {
  bronze: "border-amber-600 text-amber-400",
  silver: "border-slate-400 text-slate-300",
  gold: "border-yellow-400 text-yellow-400",
  platinum: "border-purple-400 text-purple-300",
};

const TIER_LABELS: Record<AchievementTier, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
};

interface Props {
  definition: AchievementDefinition;
  state: UserAchievement;
}

export default function AchievementCard({ definition, state }: Props) {
  const tierClass = TIER_COLORS[definition.tier];
  const earned = state.earned;

  return (
    <article
      aria-label={`${definition.title} achievement`}
      className={[
        "relative flex flex-col rounded-2xl border-2 p-6 transition-all",
        earned
          ? `${tierClass} bg-slate-900`
          : "border-slate-700 bg-slate-900/60 opacity-60 grayscale",
      ].join(" ")}
    >
      {/* Icon */}
      <div
        className="text-4xl"
        role="img"
        aria-label={definition.icon}
      >
        {definition.icon}
      </div>

      {/* Title + tier */}
      <div className="mt-4 flex items-start justify-between gap-2">
        <h3 className="text-lg font-black leading-tight">{definition.title}</h3>
        <span
          className={[
            "shrink-0 rounded-full border px-2 py-0.5 text-xs font-bold",
            tierClass,
          ].join(" ")}
          aria-label={`${TIER_LABELS[definition.tier]} tier`}
        >
          {TIER_LABELS[definition.tier]}
        </span>
      </div>

      {/* Description */}
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
        {definition.description}
      </p>

      {/* Points badge */}
      <p className="mt-3 text-xs font-bold text-yellow-400">
        +{definition.points} pts
      </p>

      {/* Progress bar (only for unearned achievements) */}
      {!earned && typeof state.progress === "number" && (
        <div className="mt-4" aria-label={`Progress: ${state.progress}%`}>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Progress</span>
            <span>{state.progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-700" role="progressbar" aria-valuenow={state.progress} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="h-2 rounded-full bg-blue-500 transition-all"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Earned badge */}
      {earned && (
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-green-400">
          <span aria-hidden="true">✅</span>
          <span>
            Earned
            {state.earnedAt
              ? ` · ${new Date(state.earnedAt).toLocaleDateString()}`
              : ""}
          </span>
        </div>
      )}

      {/* Locked overlay text */}
      {!earned && (
        <p className="mt-3 text-xs font-semibold text-slate-500" aria-hidden="true">
          🔒 Keep learning to unlock
        </p>
      )}
    </article>
  );
}
