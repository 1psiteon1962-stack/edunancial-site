import { PassportAchievement } from "@/lib/competency/types";

interface Props {
  achievements: PassportAchievement[];
  showAll?: boolean;
}

export default function AchievementList({ achievements, showAll = false }: Props) {
  const display = showAll
    ? achievements
    : achievements.filter((a) => a.earned);

  const earned = achievements.filter((a) => a.earned).length;

  return (
    <div className="rounded-2xl bg-slate-900 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Achievements</h2>
        <span className="rounded-full bg-yellow-500 px-3 py-1 text-sm font-bold text-slate-950">
          {earned} / {achievements.length}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {display.map((achievement) => (
          <div
            key={achievement.id}
            className={`rounded-xl border p-4 transition-all ${
              achievement.earned
                ? "border-yellow-500/40 bg-yellow-500/10"
                : "border-slate-700 bg-slate-800/50 opacity-50"
            }`}
          >
            <div className="text-3xl">{achievement.icon}</div>
            <h3 className="mt-2 font-bold">{achievement.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{achievement.description}</p>
            {achievement.earned && achievement.earnedAt && (
              <p className="mt-2 text-xs text-yellow-400">
                Earned {achievement.earnedAt}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
