import { Achievement } from "@/types/ai-coach";

interface Props {
  achievements: Achievement[];
  compact?: boolean;
}

export default function AchievementWidget({
  achievements,
  compact = false,
}: Props) {
  const displayed = compact ? achievements.slice(0, 6) : achievements;

  return (
    <div className="rounded-2xl bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">Achievements</h2>
        <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-sm font-bold text-yellow-400">
          {achievements.length} earned
        </span>
      </div>

      {displayed.length === 0 ? (
        <p className="mt-4 text-slate-400">
          Complete your first goal or course to earn achievements.
        </p>
      ) : (
        <ul
          className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3"
          aria-label="Earned achievements"
        >
          {displayed.map((ach) => (
            <li
              key={ach.id}
              className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-center transition hover:border-yellow-500/50"
              title={ach.description}
            >
              <span
                className="block text-4xl"
                aria-hidden="true"
                role="img"
                aria-label={ach.icon}
              >
                {ach.icon}
              </span>
              <p className="mt-2 text-sm font-bold">{ach.title}</p>
              {!compact && (
                <p className="mt-1 text-xs text-slate-400">{ach.description}</p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                {new Date(ach.earnedAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
