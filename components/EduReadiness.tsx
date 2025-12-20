"use client";

import { useState } from "react";
import { readinessQuestions } from "@/lib/readiness-questions";
import { calculateReadinessScore } from "@/lib/readiness-scoring";

export default function EduReadiness() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);

  function handleAnswer(score: number, index: number) {
    const updated = [...answers];
    updated[index] = score;
    setAnswers(updated);
  }

  function submit() {
    if (answers.length !== readinessQuestions.length) return;
    setResult(calculateReadinessScore(answers));
  }

  return (
    <div style={{ maxWidth: "720px", margin: "auto" }}>
      <h1>EduReadiness™</h1>
      <p>
        A financial readiness self-assessment focused on discipline, structure,
        and long-term durability.
      </p>

      {readinessQuestions.map((q, i) => (
        <div key={q.id} style={{ marginBottom: "1.5rem" }}>
          <strong>{q.question}</strong>
          {q.options.map((opt) => (
            <div key={opt.label}>
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

      {!result && (
        <button onClick={submit} disabled={answers.length !== readinessQuestions.length}>
          View Readiness Result
        </button>
      )}

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Status: {result.level}</h2>
          <p>{result.message}</p>
        </div>
      )}
    </div>
  );
}
