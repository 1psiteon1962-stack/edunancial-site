"use client";

import { useState } from "react";
import { readinessQuestions } from "@/lib/readiness-questions";
import { calculateReadinessScore } from "@/lib/readiness-scoring";

export default function EduReadiness() {
  const [answers, setAnswers] = useState<number[]>([]);

  function handleAnswer(index: number, score: number) {
    const next = [...answers];
    next[index] = score;
    setAnswers(next);
  }

  function handleSubmit() {
    const result = calculateReadinessScore(answers);
    alert(`Readiness level: ${result.level} (score: ${result.score})`);
  }

  return (
    <div>
      <h2>Education Readiness Diagnostic</h2>

      {readinessQuestions.map((q, i) => (
        <div key={q.id} style={{ marginBottom: "1.5rem" }}>
          <strong>{q.question}</strong>

          <div>
            {q.options.map((opt) => (
              <div key={opt.label}>
                <label>
                  <input
                    type="radio"
                    name={q.id}
                    onChange={() => handleAnswer(i, opt.score)}
                  />{" "}
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={answers.length !== readinessQuestions.length}
      >
        Calculate Readiness
      </button>
    </div>
  );
}
