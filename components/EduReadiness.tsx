"use client";

import { useState } from "react";
import { readinessQuestions } from "@/lib/readiness-questions";
import {
  calculateReadinessScore,
  ReadinessResult,
} from "@/lib/readiness-scoring";

export default function EduReadiness() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<ReadinessResult | null>(null);

  function handleAnswer(score: number) {
    setAnswers((prev) => [...prev, score]);
  }

  function handleSubmit() {
    const outcome = calculateReadinessScore(answers);
    setResult(outcome);
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h2>Business Readiness Check</h2>

      {readinessQuestions.map((q) => (
        <div key={q.id} style={{ marginBottom: 24 }}>
          <strong>{q.question}</strong>

          {q.options.map((opt) => (
            <div key={opt.value}>
              <label>
                <input
                  type="radio"
                  name={q.id}
                  onChange={() => handleAnswer(opt.score)}
                />{" "}
                {opt.label}
              </label>
            </div>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit}>Calculate Readiness</button>

      {result && (
        <div style={{ marginTop: 24 }}>
          <h3>{result.level}</h3>
          <p>{result.message}</p>
          <p>
            <strong>Total Score:</strong> {result.total}
          </p>
        </div>
      )}
    </div>
  );
}
