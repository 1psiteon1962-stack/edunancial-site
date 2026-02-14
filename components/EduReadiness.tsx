"use client";

import { useState } from "react";
import { calculateReadinessScore, ReadinessResult } from "@/lib/readiness-scoring";

type ReadinessOption = {
  value: string;
  label: string;
  score: number;
};

type ReadinessQuestion = {
  id: string;
  question: string;
  options: ReadinessOption[];
};

const QUESTIONS: ReadinessQuestion[] = [
  {
    id: "structure",
    question: "Do you have a formal legal and operating structure?",
    options: [
      { value: "none", label: "No structure", score: 0 },
      { value: "basic", label: "Basic (LLC / sole prop)", score: 1 },
      { value: "formal", label: "Formal entity with docs", score: 2 },
    ],
  },
  {
    id: "finance",
    question: "How disciplined are your financial systems?",
    options: [
      { value: "none", label: "No tracking", score: 0 },
      { value: "basic", label: "Some tracking", score: 1 },
      { value: "strong", label: "Budgets, forecasts, controls", score: 2 },
    ],
  },
  {
    id: "operations",
    question: "Are your operations documented and repeatable?",
    options: [
      { value: "none", label: "Ad hoc", score: 0 },
      { value: "partial", label: "Some processes", score: 1 },
      { value: "systemized", label: "Fully systemized", score: 2 },
    ],
  },
];

export default function EduReadiness() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ReadinessResult | null>(null);

  function handleAnswer(questionId: string, score: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  }

  function handleSubmit() {
    const scores = Object.values(answers);
    const outcome = calculateReadinessScore(scores);
    setResult(outcome);
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h2>Business Readiness Assessment</h2>

      {QUESTIONS.map((q) => (
        <div key={q.id} style={{ marginBottom: 24 }}>
          <p>
            <strong>{q.question}</strong>
          </p>

          {q.options.map((opt) => (
            <div key={opt.value}>
              <label>
                <input
                  type="radio"
                  name={q.id}
                  onChange={() => handleAnswer(q.id, opt.score)}
                />{" "}
                {opt.label}
              </label>
            </div>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit}>Calculate Readiness</button>

      {result && (
        <div style={{ marginTop: 32 }}>
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
