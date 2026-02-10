"use client";

import { useState } from "react";
import { readinessQuestions } from "@/lib/readiness-questions";
import { calculateReadinessScore } from "@/lib/readiness-scoring";

export default function EduReadiness() {
  const [answers, setAnswers] = useState<number[]>([]);

  function handleSelect(index: number, weight: number) {
    const next = [...answers];
    next[index] = weight;
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
          {/* FIX: the property is `prompt`, NOT `question` */}
          <strong>{q.prompt}</strong>

          <div>
            {q.options.map((opt) => (
              <div key={opt.label}>
                <label>
                  <input
                    type="radio"
                    name={q.id}
                    onChange={() => handleSelect(i, opt.weight)}
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
