import type { LeaderboardEntry, LeaderboardScope } from "@/lib/gamification/types";
import { LEADERBOARD_SCOPE_LABELS } from "@/lib/gamification/leaderboardConfig";

interface Props {
  entries: LeaderboardEntry[];
  scope: LeaderboardScope;
  /** Highlight a specific userId as the current user. */
  currentUserId?: string;
}

const RANK_STYLES: Record<number, string> = {
  1: "text-yellow-400 font-black text-xl",
  2: "text-slate-300 font-black text-lg",
  3: "text-amber-600 font-black text-lg",
};

const RANK_ICONS: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

export default function LeaderboardTable({ entries, scope, currentUserId }: Props) {
  return (
    <section
      aria-label={`${LEADERBOARD_SCOPE_LABELS[scope]} leaderboard`}
      className="rounded-2xl bg-slate-900 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] font-bold text-yellow-400">
            Leaderboard
          </p>
          <h2 className="text-2xl font-black mt-1">
            {LEADERBOARD_SCOPE_LABELS[scope]}
          </h2>
        </div>
        <span className="text-2xl" role="img" aria-label="Trophy">🏆</span>
      </div>

      {/* Table */}
      <table className="w-full" role="table" aria-label={`${LEADERBOARD_SCOPE_LABELS[scope]} rankings`}>
        <thead>
          <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-800">
            <th className="px-6 py-3 text-left font-semibold" scope="col">Rank</th>
            <th className="px-6 py-3 text-left font-semibold" scope="col">Student</th>
            <th className="px-6 py-3 text-right font-semibold" scope="col">Points</th>
            <th className="hidden sm:table-cell px-6 py-3 text-right font-semibold" scope="col">Streak</th>
            <th className="hidden md:table-cell px-6 py-3 text-right font-semibold" scope="col">Achievements</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isCurrentUser = entry.userId === currentUserId;
            const rankStyle = RANK_STYLES[entry.rank] ?? "text-slate-400";
            const icon = RANK_ICONS[entry.rank];

            return (
              <tr
                key={entry.userId}
                className={[
                  "border-b border-slate-800/50 transition-colors",
                  isCurrentUser
                    ? "bg-blue-900/30 ring-1 ring-inset ring-blue-600"
                    : "hover:bg-slate-800/50",
                ].join(" ")}
                aria-current={isCurrentUser ? "true" : undefined}
              >
                {/* Rank */}
                <td className="px-6 py-4">
                  <span className={rankStyle} aria-label={`Rank ${entry.rank}`}>
                    {icon ? (
                      <span role="img" aria-label={`${entry.rank} place`}>{icon}</span>
                    ) : (
                      `#${entry.rank}`
                    )}
                  </span>
                </td>

                {/* Student */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar placeholder */}
                    <div
                      className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold"
                      aria-hidden="true"
                    >
                      {entry.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold leading-tight">
                        {entry.displayName}
                        {isCurrentUser && (
                          <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold">
                            You
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Points */}
                <td className="px-6 py-4 text-right">
                  <span className="font-black text-yellow-400">
                    {entry.points.toLocaleString()}
                  </span>
                  <span className="ml-1 text-xs text-slate-500">pts</span>
                </td>

                {/* Streak */}
                <td className="hidden sm:table-cell px-6 py-4 text-right text-slate-300">
                  <span className="text-sm">🔥 {entry.streak}d</span>
                </td>

                {/* Achievements */}
                <td className="hidden md:table-cell px-6 py-4 text-right text-slate-300">
                  <span className="text-sm">🏅 {entry.achievementCount}</span>
                </td>
              </tr>
            );
          })}

          {entries.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                No entries yet. Start learning to appear on the leaderboard!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
