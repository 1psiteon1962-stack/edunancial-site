import type { UserPoints } from "@/lib/gamification/types";
import { POINTS_CONFIG } from "@/lib/gamification/pointsConfig";

interface Props {
  points: UserPoints;
  /** Show the full breakdown. Default: false (compact mode) */
  expanded?: boolean;
}

export default function PointsBadge({ points, expanded = false }: Props) {
  if (!expanded) {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-full bg-yellow-500/20 px-4 py-2 ring-1 ring-yellow-500"
        aria-label={`${points.totalPoints} total points`}
      >
        <span aria-hidden="true" className="text-lg">⭐</span>
        <span className="font-black text-yellow-400">{points.totalPoints.toLocaleString()}</span>
        <span className="text-xs text-yellow-300">pts</span>
      </div>
    );
  }

  return (
    <section aria-label="Points summary" className="rounded-2xl bg-slate-900 p-6">
      <h2 className="text-2xl font-black">Your Points</h2>

      {/* Totals */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <TotalCard label="Total" value={points.totalPoints} accent="yellow" />
        <TotalCard label="This Week" value={points.weeklyPoints} accent="blue" />
        <TotalCard label="This Month" value={points.monthlyPoints} accent="green" />
      </div>

      {/* How to earn points */}
      <div className="mt-8">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
          How to Earn Points
        </h3>
        <ul className="space-y-2" role="list">
          {POINTS_CONFIG.map((entry) => (
            <li
              key={entry.type}
              className={[
                "flex items-center justify-between rounded-lg px-4 py-3",
                entry.active ? "bg-slate-800" : "bg-slate-800/40 opacity-50",
              ].join(" ")}
            >
              <div>
                <span className="font-semibold text-sm">{entry.label}</span>
                {!entry.active && (
                  <span className="ml-2 rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-400">
                    Coming Soon
                  </span>
                )}
                <p className="text-xs text-slate-500 mt-0.5">{entry.description}</p>
              </div>
              <span className="shrink-0 font-black text-yellow-400">+{entry.value}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent transactions */}
      {points.transactions.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
            Recent Activity
          </h3>
          <ul className="space-y-2" role="list">
            {points.transactions
              .slice(-5)
              .reverse()
              .map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg bg-slate-800 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold capitalize">
                      {tx.event.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-black text-green-400">+{tx.points}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function TotalCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "yellow" | "blue" | "green";
}) {
  const colorMap = {
    yellow: "bg-yellow-900/40 ring-yellow-600",
    blue: "bg-blue-900/40 ring-blue-600",
    green: "bg-green-900/40 ring-green-600",
  };
  const textMap = {
    yellow: "text-yellow-400",
    blue: "text-blue-400",
    green: "text-green-400",
  };

  return (
    <div className={`rounded-xl p-4 text-center ring-1 ${colorMap[accent]}`}>
      <p className={`text-2xl font-black ${textMap[accent]}`}>
        {value.toLocaleString()}
      </p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  );
}
