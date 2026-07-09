import Link from "next/link";
import { GoalProgress } from "@/types/ai-coach";
import {
  GOAL_CATEGORY_ICONS,
  GOAL_CATEGORY_LABELS,
} from "@/lib/ai-coach/goal-engine";

interface Props {
  goalProgress: GoalProgress;
  showDetails?: boolean;
}

const STATUS_COLORS = {
  notStarted: "border-slate-600",
  inProgress: "border-blue-500",
  onTrack: "border-green-500",
  atRisk: "border-red-500",
  completed: "border-yellow-500",
};

const STATUS_LABELS = {
  notStarted: "Not Started",
  inProgress: "In Progress",
  onTrack: "On Track",
  atRisk: "At Risk",
  completed: "Completed ✓",
};

const STATUS_TEXT_COLORS = {
  notStarted: "text-slate-400",
  inProgress: "text-blue-400",
  onTrack: "text-green-400",
  atRisk: "text-red-400",
  completed: "text-yellow-400",
};

export default function GoalCard({ goalProgress, showDetails = false }: Props) {
  const { goal, percentComplete, amountRemaining, daysRemaining, isOnTrack, weeklyRequired } =
    goalProgress;

  const icon = GOAL_CATEGORY_ICONS[goal.category];
  const label = GOAL_CATEGORY_LABELS[goal.category];
  const borderColor = STATUS_COLORS[goal.status];
  const statusText = STATUS_LABELS[goal.status];
  const statusColor = STATUS_TEXT_COLORS[goal.status];

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: goal.currency,
    maximumFractionDigits: 0,
  });

  return (
    <article
      className={`rounded-2xl border-l-4 ${borderColor} bg-slate-900 p-6`}
      aria-label={`${goal.title} goal: ${percentComplete}% complete`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            {icon}
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {label}
            </p>
            <h3 className="mt-1 text-xl font-black">{goal.title}</h3>
          </div>
        </div>
        <span className={`text-sm font-bold ${statusColor}`}>{statusText}</span>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm text-slate-300">
          <span>{formatter.format(goal.currentAmount)}</span>
          <span>{formatter.format(goal.targetAmount)}</span>
        </div>
        <div
          className="h-3 w-full rounded-full bg-slate-700"
          role="progressbar"
          aria-valuenow={percentComplete}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${goal.title}: ${percentComplete}% complete`}
        >
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isOnTrack ? "bg-green-500" : "bg-red-500"
            }`}
            style={{ width: `${percentComplete}%` }}
          />
        </div>
        <p className="mt-1 text-right text-sm font-bold">{percentComplete}%</p>
      </div>

      {showDetails && (
        <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-slate-300">
          <div>
            <p className="text-slate-400">Remaining</p>
            <p className="font-bold text-white">
              {formatter.format(amountRemaining)}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Days Left</p>
            <p className="font-bold text-white">{daysRemaining}d</p>
          </div>
          <div>
            <p className="text-slate-400">Weekly Target</p>
            <p className="font-bold text-white">
              {formatter.format(weeklyRequired)}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Status</p>
            <p className={`font-bold ${statusColor}`}>{statusText}</p>
          </div>
        </div>
      )}

      {goal.milestones.length > 0 && showDetails && (
        <div className="mt-5">
          <p className="mb-3 text-sm font-bold text-slate-400">Milestones</p>
          <ul className="space-y-2">
            {goal.milestones.map((milestone) => (
              <li
                key={milestone.id}
                className="flex items-center gap-3 text-sm"
              >
                <span
                  className={`h-4 w-4 rounded-full border-2 ${
                    milestone.completedAt
                      ? "border-green-500 bg-green-500"
                      : "border-slate-600"
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={
                    milestone.completedAt ? "text-green-400" : "text-slate-300"
                  }
                >
                  {milestone.title} — {formatter.format(milestone.targetAmount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5">
        <Link
          href="/ai-coach/goals"
          className="text-sm font-bold text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}
