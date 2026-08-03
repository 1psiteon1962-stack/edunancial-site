"use client";

import { useMemo, useState } from "react";

import { useAILearning } from "@/components/ai-learning/AILearningProvider";

export default function AILearningCoachWidget() {
  const { context, askCoach } = useAILearning();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    message: string;
    suggestions: string[];
    disclaimers: string[];
    milestone: string | null;
    contextSummary: string;
    enabled: boolean;
  } | null>(null);

  const contextLabel = useMemo(() => {
    if (!context) return "Context loading…";
    return [context.track, context.level ? `L${context.level}` : null, context.lessonId]
      .filter(Boolean)
      .join(" · ") || "General learning";
  }, [context]);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[92vw] max-w-sm">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-2xl border border-blue-400/40 bg-[#0b1730] px-4 py-3 text-left text-sm font-semibold text-blue-100 shadow-lg hover:border-blue-300"
          aria-label="Open AI Learning Coach"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-blue-300">AI Learning Coach</div>
          <div className="mt-1 truncate text-slate-300">{contextLabel}</div>
        </button>
      ) : (
        <div className="rounded-2xl border border-slate-700 bg-[#0b1730] shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-700 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Edunancial AI Learning Network</p>
              <p className="mt-1 text-xs text-slate-400">{contextLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-slate-800"
            >
              Close
            </button>
          </div>

          <div className="space-y-3 px-4 py-3">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              placeholder="Ask about this lesson, request a quiz, or compare jurisdictions."
              className="w-full rounded-lg border border-slate-700 bg-[#08101f] p-3 text-sm text-white"
            />
            <button
              type="button"
              onClick={async () => {
                if (!message.trim()) return;
                setLoading(true);
                try {
                  const next = await askCoach(message.trim());
                  setResponse(next);
                } finally {
                  setLoading(false);
                }
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Coaching..." : "Ask AI Coach"}
            </button>

            {response && (
              <div className="space-y-3 rounded-xl border border-slate-700 bg-[#08101f] p-3 text-sm text-slate-200">
                <p className="whitespace-pre-line">{response.message}</p>
                {response.milestone && (
                  <p className="rounded-md border border-green-500/30 bg-green-500/10 p-2 text-xs text-green-300">
                    {response.milestone}
                  </p>
                )}
                {response.suggestions.length > 0 && (
                  <ul className="list-disc space-y-1 pl-5 text-xs text-slate-300">
                    {response.suggestions.map((suggestion) => (
                      <li key={suggestion}>{suggestion}</li>
                    ))}
                  </ul>
                )}
                {response.disclaimers.length > 0 && (
                  <div className="space-y-1 text-[11px] text-yellow-300">
                    {response.disclaimers.map((disclaimer) => (
                      <p key={disclaimer}>{disclaimer}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
