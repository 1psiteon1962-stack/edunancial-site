"use client";

import type { LearningPath } from "@/lib/ai-tutor/types";
import Link from "next/link";

interface Props {
  path: LearningPath;
}

export default function LearningPathPanel({ path }: Props) {
  return (
    <section aria-labelledby="learning-path-heading">
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="learning-path-heading"
          className="text-sm font-bold uppercase tracking-widest text-yellow-400"
        >
          Your Learning Path
        </h2>
        <span className="text-xs text-slate-400">
          {path.percentComplete}% complete
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="mb-5 h-1.5 w-full rounded-full bg-slate-700"
        role="progressbar"
        aria-valuenow={path.percentComplete}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Learning path progress: ${path.percentComplete}%`}
      >
        <div
          className="h-full rounded-full bg-yellow-400 transition-all duration-500"
          style={{ width: `${path.percentComplete}%` }}
        />
      </div>

      <p className="mb-4 text-sm font-semibold text-white">{path.title}</p>

      <ol className="space-y-2">
        {path.steps.map((step, index) => (
          <li key={step.stepId} className="flex items-start gap-3">
            {/* Step indicator */}
            <span
              aria-hidden="true"
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                step.isCompleted
                  ? "bg-green-500 text-white"
                  : step.isUnlocked
                  ? "bg-yellow-400 text-slate-900"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              {step.isCompleted ? "✓" : index + 1}
            </span>

            <div className="min-w-0 flex-1">
              {step.isUnlocked && step.courseId ? (
                <Link
                  href={`/courses/${step.courseId}`}
                  className={`block text-sm font-medium transition ${
                    step.isCompleted
                      ? "text-slate-400 line-through"
                      : "text-white hover:text-yellow-300"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400`}
                >
                  {step.title}
                </Link>
              ) : (
                <span
                  className={`text-sm font-medium ${
                    step.isCompleted ? "text-slate-400 line-through" : "text-slate-500"
                  }`}
                >
                  {step.title}
                  {!step.isUnlocked && (
                    <span className="ml-2 text-xs text-slate-600" aria-label="Locked">
                      🔒
                    </span>
                  )}
                </span>
              )}
              <p className="text-xs text-slate-500">
                ~{Math.round(step.estimatedMinutes / 60)}h · {step.difficulty}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-xs text-slate-500">
        Estimated total: {path.estimatedTotalHours}h
      </p>
    </section>
  );
}
