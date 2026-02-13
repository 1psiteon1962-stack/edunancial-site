"use client";

import React, { useMemo, useState } from "react";

type ReadinessCategory = "Structure" | "Money" | "Sales" | "Operations" | "Legal";

type ReadinessAnswerOption = {
  label: string;
  points: number; // 0–5
};

type ReadinessQuestion = {
  id: string;
  category: ReadinessCategory;
  prompt: string;
  options: ReadinessAnswerOption[];
};

type ReadinessBreakdownItem = {
  category: ReadinessCategory;
  score: number;
  maxScore: number;
};

type ReadinessResult = {
  level: string;
  totalScore: number;
  message: string;
  breakdown: ReadinessBreakdownItem[];
};

const QUESTIONS: ReadinessQuestion[] = [
  {
    id: "q-structure-1",
    category: "Structure",
    prompt: "Do you have a clear weekly plan with priorities and deadlines?",
    options: [
      { label: "No plan yet", points: 0 },
      { label: "Somewhat, but inconsistent", points: 2 },
      { label: "Yes, I follow it most weeks", points: 4 },
      { label: "Yes, and I review/adjust weekly", points: 5 },
    ],
  },
  {
    id: "q-money-1",
    category: "Money",
    prompt: "Do you track cash in/out and know your runway (months of survival)?",
    options: [
      { label: "Not at all", points: 0 },
      { label: "Rough idea only", points: 2 },
      { label: "Yes, monthly", points: 4 },
      { label: "Yes, weekly with projections", points: 5 },
    ],
  },
  {
    id: "q-sales-1",
    category: "Sales",
    prompt: "Do you have a repeatable way to get leads (not just referrals)?",
    options: [
      { label: "No, it’s random", points: 0 },
      { label: "Sometimes, but not predictable", points: 2 },
      { label: "Yes, 1–2 reliable channels", points: 4 },
      { label: "Yes, multiple channels + tracking", points: 5 },
    ],
  },
  {
    id: "q-ops-1",
    category: "Operations",
    prompt: "Are your core tasks documented so someone else could execute them?",
    options: [
      { label: "No documentation", points: 0 },
      { label: "A few notes here and there", points: 2 },
      { label: "Yes, key processes documented", points: 4 },
      { label: "Yes, SOPs + checklists", points: 5 },
    ],
  },
  {
    id: "q-legal-1",
    category: "Legal",
    prompt: "Do you use written agreements (clients, partners, contractors) consistently?",
    options: [
      { label: "Rarely", points: 0 },
      { label: "Sometimes", points: 2 },
      { label: "Usually", points: 4 },
      { label: "Always + templates + storage", points: 5 },
    ],
  },
];

function buildResult(totalScore: number, maxTotal: number, breakdown: ReadinessBreakdownItem[]): ReadinessResult {
  const pct = maxTotal === 0 ? 0 : totalScore / maxTotal;

  if (pct < 0.35) {
    return {
      level: "Foundation",
      totalScore,
      message:
        "You’re early—good. Your next win is structure: pick one core offer, one lead channel, and one weekly scoreboard. Eliminate random effort.",
      breakdown,
    };
  }

  if (pct < 0.65) {
    return {
      level: "Builder",
      totalScore,
      message:
        "You have momentum, but it’s fragile. Your next win is repeatability: document the work, track the money weekly, and tighten your sales process so growth doesn’t break you.",
      breakdown,
    };
  }

  if (pct < 0.85) {
    return {
      level: "Operator",
      totalScore,
      message:
        "You’re operating like a real business. Your next win is scale-readiness: strengthen governance, improve forecasting, and build redundancy so results don’t depend on one person.",
      breakdown,
    };
  }

  return {
    level: "Scale-Ready",
    totalScore,
    message:
      "You’re built to scale. Your next win is expansion discipline: protect IP/contracts, keep financial controls tight, and add growth channels without adding chaos.",
    breakdown,
  };
}

export default function EduReadiness() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ReadinessResult | null>(null);

  const maxTotal = useMemo(() => {
    // max per question is the highest points in its options
    return QUESTIONS.reduce((sum, q) => {
      const maxQ = Math.max(...q.options.map((o) => o.points));
      return sum + maxQ;
    }, 0);
  }, []);

  const totalScore = useMemo(() => {
    return Object.values(answers).reduce((a, b) => a + b, 0);
  }, [answers]);

  const isComplete = useMemo(() => {
    return QUESTIONS.every((q) => typeof answers[q.id] === "number");
  }, [answers]);

  const breakdown = useMemo<ReadinessBreakdownItem[]>(() => {
    const byCategory: Record<ReadinessCategory, { score: number; maxScore: number }> = {
      Structure: { score: 0, maxScore: 0 },
      Money: { score: 0, maxScore: 0 },
      Sales: { score: 0, maxScore: 0 },
      Operations: { score: 0, maxScore: 0 },
      Legal: { score: 0, maxScore: 0 },
    };

    for (const q of QUESTIONS) {
      const maxQ = Math.max(...q.options.map((o) => o.points));
      byCategory[q.category].maxScore += maxQ;

      const val = answers[q.id];
      if (typeof val === "number") byCategory[q.category].score += val;
    }

    return (Object.keys(byCategory) as ReadinessCategory[]).map((cat) => ({
      category: cat,
      score: byCategory[cat].score,
      maxScore: byCategory[cat].maxScore,
    }));
  }, [answers]);

  function reset() {
    setAnswers({});
    setResult(null);
  }

  function submit() {
    if (!isComplete) return;
    setResult(buildResult(totalScore, maxTotal, breakdown));
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Business Readiness Check</h2>
        <button
          type="button"
          onClick={reset}
          style={{
            border: "1px solid #ddd",
            background: "white",
            padding: "8px 12px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      <p style={{ marginTop: 8, color: "#555" }}>
        Answer each question honestly. This is not about ego — it’s about identifying the bottleneck that will hurt you
        later.
      </p>

      <div style={{ marginTop: 18, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        {QUESTIONS.map((q, idx) => (
          <div
            key={q.id}
            style={{
              padding: 16,
              borderTop: idx === 0 ? "none" : "1px solid #eee",
              background: "white",
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  border: "1px solid #ddd",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 12,
                  flex: "0 0 auto",
                  marginTop: 2,
                }}
              >
                {idx + 1}
              </div>

              <div style={{ flex: "1 1 auto" }}>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{q.category}</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{q.prompt}</div>

                <div style={{ display: "grid", gap: 8 }}>
                  {q.options.map((opt) => {
                    const checked = answers[q.id] === opt.points;
                    return (
                      <label
                        key={`${q.id}-${opt.points}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 12px",
                          border: "1px solid #e5e5e5",
                          borderRadius: 10,
                          cursor: "pointer",
                          background: checked ? "#f7f7f7" : "white",
                        }}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={checked}
                          onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.points }))}
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ color: "#444" }}>
          <strong>Score:</strong> {totalScore} / {maxTotal} {!isComplete ? "(incomplete)" : ""}
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!isComplete}
          style={{
            border: "none",
            padding: "10px 14px",
            borderRadius: 10,
            cursor: isComplete ? "pointer" : "not-allowed",
            opacity: isComplete ? 1 : 0.6,
          }}
        >
          Get Result
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 24, padding: 16, border: "1px solid #eee", borderRadius: 12, background: "white" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <h3 style={{ margin: 0 }}>{result.level}</h3>
            <div style={{ color: "#444" }}>
              <strong>Total Score:</strong> {result.totalScore} / {maxTotal}
            </div>
          </div>

          <p style={{ marginTop: 10, marginBottom: 0, color: "#444", lineHeight: 1.5 }}>{result.message}</p>

          <div style={{ marginTop: 16 }}>
            <h4 style={{ margin: "0 0 10px 0" }}>Breakdown</h4>
            <div style={{ display: "grid", gap: 10 }}>
              {result.breakdown.map((b) => {
                const pct = b.maxScore === 0 ? 0 : Math.round((b.score / b.maxScore) * 100);
                return (
                  <div
                    key={b.category}
                    style={{
                      border: "1px solid #eee",
                      borderRadius: 10,
                      padding: 12,
                      background: "white",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <strong>{b.category}</strong>
                      <span style={{ color: "#555" }}>
                        {b.score}/{b.maxScore} ({pct}%)
                      </span>
                    </div>
                    <div style={{ height: 8, borderRadius: 999, background: "#efefef", marginTop: 8 }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          borderRadius: 999,
                          background: "#cfcfcf",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 16, fontSize: 12, color: "#666" }}>
            Tip: Your fastest growth comes from fixing the lowest-scoring category first.
          </div>
        </div>
      )}
    </div>
  );
}
```0
