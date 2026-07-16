"use client";

// ─────────────────────────────────────────────────────────────
// ReflectionQuestions — Guided post-video reflection panel
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import type { ReflectionQuestion } from "@/lib/video-learning/types";

interface ReflectionQuestionsProps {
  questions: ReflectionQuestion[];
}

export default function ReflectionQuestions({ questions }: ReflectionQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (!questions.length) return null;

  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
        <span className="text-2xl">🤔</span>
        <div>
          <h3 className="font-black text-lg text-white">Reflection Questions</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Take a moment to think before watching the next lesson.
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-800">
        {questions.map((q, idx) => (
          <div key={q.id} className="px-6 py-5">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-black flex items-center justify-center mt-0.5">
                {idx + 1}
              </span>
              <div className="flex-1 space-y-3">
                <p className="text-white font-semibold text-sm leading-relaxed">{q.question}</p>

                {q.hint && (
                  <button
                    onClick={() => toggle(q.id)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition"
                  >
                    {expanded[q.id] ? "▲ Hide hint" : "▼ Show hint"}
                  </button>
                )}

                {q.hint && expanded[q.id] && (
                  <p className="text-xs text-slate-400 italic border-l-2 border-slate-700 pl-3 leading-relaxed">
                    {q.hint}
                  </p>
                )}

                <textarea
                  rows={3}
                  value={answers[q.id] ?? ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder="Write your thoughts here… (your answers are private and stay on your device)"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 resize-none focus:outline-none focus:border-yellow-500 transition"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-slate-800 bg-slate-950">
        <p className="text-xs text-slate-500 leading-relaxed">
          Your reflections are saved locally on your device and are never transmitted to Edunancial servers.
          Use this space to think deeply — financial competency is built through reflection and action.
        </p>
      </div>
    </div>
  );
}
