import Link from "next/link";
import { NextAction, RecommendationPriority } from "@/types/ai-coach";

interface Props {
  actions: NextAction[];
}

const PRIORITY_INDICATOR: Record<RecommendationPriority, { dot: string; label: string }> = {
  critical: { dot: "bg-red-500", label: "Critical" },
  high: { dot: "bg-orange-500", label: "High" },
  medium: { dot: "bg-blue-500", label: "Medium" },
  low: { dot: "bg-slate-500", label: "Low" },
};

const TYPE_ICON: Record<string, string> = {
  course: "📚",
  goal: "🎯",
  assessment: "📋",
  action: "⚡",
};

export default function NextActionsWidget({ actions }: Props) {
  return (
    <div className="rounded-2xl bg-slate-900 p-6">
      <h2 className="text-2xl font-black">Recommended Next Actions</h2>
      <p className="mt-1 text-sm text-slate-400">
        Personalized actions to maximize your progress today
      </p>

      <ol className="mt-6 space-y-4" aria-label="Next actions">
        {actions.map((action, index) => {
          const indicator = PRIORITY_INDICATOR[action.priority];
          const icon = TYPE_ICON[action.type] ?? "➡️";

          return (
            <li
              key={action.id}
              className="rounded-xl bg-slate-800 p-5 transition hover:bg-slate-700"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-lg font-black text-white">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span aria-hidden="true">{icon}</span>
                    <h3 className="font-bold">{action.title}</h3>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs`}
                      aria-label={`Priority: ${indicator.label}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${indicator.dot}`}
                        aria-hidden="true"
                      />
                      {indicator.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">
                    {action.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <span className="text-xs text-slate-400">
                      ⏱ {action.estimatedMinutes}m
                    </span>
                    <Link
                      href={action.actionUrl}
                      className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      Start →
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
