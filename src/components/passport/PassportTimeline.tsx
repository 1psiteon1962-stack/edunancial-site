import { PassportEntry } from "@/lib/competency/types";

interface Props {
  history: PassportEntry[];
}

const EVENT_ICONS: Record<PassportEntry["eventType"], string> = {
  assessment: "📊",
  course_completed: "📖",
  certificate_earned: "📜",
  level_up: "🏆",
  achievement_unlocked: "⭐",
};

export default function PassportTimeline({ history }: Props) {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900 p-8">
        <h2 className="text-2xl font-bold">Achievement History</h2>
        <p className="mt-6 text-slate-400">
          Your achievement history will appear here as you progress.
        </p>
      </div>
    );
  }

  const sorted = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="rounded-2xl bg-slate-900 p-8">
      <h2 className="text-2xl font-bold">Achievement History</h2>

      <div className="mt-6 space-y-4">
        {sorted.map((entry) => (
          <div
            key={entry.entryId}
            className="flex gap-4 rounded-xl border border-slate-700 bg-slate-800/50 p-5"
          >
            <div className="shrink-0 text-2xl">
              {EVENT_ICONS[entry.eventType]}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-bold">{entry.title}</h3>
                {entry.levelSnapshot && (
                  <span className="rounded-full bg-blue-700 px-2 py-0.5 text-xs font-bold">
                    {entry.levelSnapshot}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-400">{entry.description}</p>
              <p className="mt-2 text-xs text-slate-500">{entry.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
