import Link from "next/link";
import { LearningHistory } from "@/types/ai-coach";
import { CONTENT_TYPE_ICONS } from "@/lib/ai-coach/learning-engine";

interface Props {
  history: LearningHistory;
}

export default function LearningProgressWidget({ history }: Props) {
  const recentItems = history.completedItems.slice(-5).reverse();

  return (
    <div className="rounded-2xl bg-slate-900 p-6">
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-black">Learning Progress</h2>
        <Link
          href="/ai-coach/learning"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          View All
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-xl bg-slate-800 p-4">
          <p
            className="text-3xl font-black text-blue-400"
            aria-label={`${history.totalMinutes} total learning minutes`}
          >
            {history.totalMinutes >= 60
              ? `${Math.round(history.totalMinutes / 60)}h`
              : `${history.totalMinutes}m`}
          </p>
          <p className="mt-1 text-xs text-slate-400">Total Learned</p>
        </div>
        <div className="rounded-xl bg-slate-800 p-4">
          <p
            className="text-3xl font-black text-orange-400"
            aria-label={`${history.currentStreak} day streak`}
          >
            🔥 {history.currentStreak}
          </p>
          <p className="mt-1 text-xs text-slate-400">Day Streak</p>
        </div>
        <div className="rounded-xl bg-slate-800 p-4">
          <p
            className="text-3xl font-black text-green-400"
            aria-label={`${history.completedItems.length} items completed`}
          >
            {history.completedItems.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">Completed</p>
        </div>
      </div>

      {recentItems.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-bold text-slate-400 uppercase tracking-widest">
            Recently Completed
          </p>
          <ul className="space-y-2">
            {recentItems.map((item) => {
              const icon = CONTENT_TYPE_ICONS[item.type] ?? "📄";
              const date = new Date(item.completedAt).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric" }
              );
              return (
                <li
                  key={`${item.itemId}-${item.completedAt}`}
                  className="flex items-center justify-between rounded-lg bg-slate-800 px-4 py-3 text-sm"
                >
                  <span>
                    <span aria-hidden="true">{icon} </span>
                    <span className="text-slate-300">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)} completed
                    </span>
                  </span>
                  <span className="text-slate-500">{date}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
