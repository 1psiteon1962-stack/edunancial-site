"use client";

import { useState } from "react";
import {
  readinessQuestions,
  ReadinessQuestion
} from "@/lib/readiness-questions";
import {
  calculateReadinessScore,
  ReadinessResult
} from "@/lib/readiness-scoring";

export default function EduReadiness() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<ReadinessResult | null>(null);

  function handleAnswer(score: number, index: number) {
    const next = [...answers];
    next[index] = score;
    setAnswers(next);
    setResult(calculateReadinessScore(next));
  }

  return (
    <div>
      {readinessQuestions.map((q: ReadinessQuestion, i: number) => (
        <div key={q.id} style={{ marginBottom: "1.25rem" }}>
          <strong>{q.question}</strong>

          {q.options.map((opt) => (
            <div key={opt.value}>
              <label>
                <input
                  type="radio"
                  name={q.id}
                  onChange={() => handleAnswer(opt.score, i)}
                />{" "}
                {opt.label}
              </label>
            </div>
          ))}
        </div>
      ))}

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h3>{result.level}</h3>
          <p>{result.message}</p>
        </div>
      )}
    </div>
  );
}
