"use client";

// ─────────────────────────────────────────────────────────────
// LessonObjectives — Learning objectives and key definitions
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import type { KeyDefinition } from "@/lib/video-learning/types";

interface LessonObjectivesProps {
  objectives?: string[];
  definitions?: KeyDefinition[];
  estimatedMinutes?: number;
}

export default function LessonObjectives({
  objectives,
  definitions,
  estimatedMinutes,
}: LessonObjectivesProps) {
  const [showDefs, setShowDefs] = useState(false);

  if (!objectives?.length && !definitions?.length) return null;

  return (
    <div className="space-y-4">
      {/* Learning objectives */}
      {objectives && objectives.length > 0 && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-black text-lg text-white">Learning Objectives</h3>
              {estimatedMinutes && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Estimated completion: {estimatedMinutes} min (video + activities)
                </p>
              )}
            </div>
          </div>
          <ul className="space-y-3">
            {objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-yellow-400 text-black text-xs font-black flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-slate-300 text-sm leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key definitions */}
      {definitions && definitions.length > 0 && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <button
            onClick={() => setShowDefs(!showDefs)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-800 transition text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <h3 className="font-black text-lg text-white">
                Key Definitions
                <span className="ml-2 text-xs font-normal text-slate-400">
                  ({definitions.length} terms)
                </span>
              </h3>
            </div>
            <span className="text-slate-400 text-sm">{showDefs ? "▲" : "▼"}</span>
          </button>

          {showDefs && (
            <div className="divide-y divide-slate-800">
              {definitions.map((def, i) => (
                <div key={i} className="px-6 py-4">
                  <p className="font-bold text-yellow-400 text-sm">{def.term}</p>
                  <p className="mt-1 text-slate-300 text-sm leading-relaxed">{def.definition}</p>
                  {def.example && (
                    <p className="mt-2 text-slate-400 text-xs italic border-l-2 border-slate-700 pl-3">
                      Example: {def.example}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
