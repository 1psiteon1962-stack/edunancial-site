"use client";

import { useState } from "react";

type ReadinessOption = {
  label: string;
  score: number;
};

type ReadinessQuestion = {
  id: string;
  question: string;
  options: ReadinessOption[];
};

type ReadinessResult = {
  level: string;
  message: string;
  total: number;
};

const readinessQuestions: ReadinessQuestion[] = [
  {
    id: "structure",
    question: "Do you have a legal and financial structure in place?",
    options: [
      { label: "No structure", score: 0 },
      { label: "Partial structure", score: 1 },
      { label: "Fully structured", score: 2 },
    ],
  },
  {
    id: "systems",
    question: "Do you operate with documented systems and processes?",
    options: [
      { label: "No systems", score: 0 },
      { label: "Some systems", score: 1 },
      { label: "Documented systems", score: 2 },
    ],
  },
  {
    id: "financials",
    question: "Do you track cash flow and financial performance?",
    options: [
      { label: "No tracking", score: 0 },
      { label: "Basic tracking", score: 1 },
      { label: "Full financial controls", score: 2 },
    ],
  },
];

function calculateReadinessScore(scores: number[]): ReadinessResult {
  const total = scores.reduce((sum, v) => sum + v, 0);

  if (total <= 2) {
    return {
      level: "Foundational",
      message:
        "You are at the beginning stage. Focus on structure, discipline, and repeatable systems.",
      total,
    };
  }

  if (total <= 4) {
    return {
      level: "Developing",
      message:
        "You have some structure in place, but gaps remain. Strengthen controls and consistency.",
      total,
    };
  }

  return {
    level: "Scale-Ready",
    message:
      "You demonstrate strong readiness. Your next risks are governance and execution at scale.",
    total,
  };
}

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
    <div>
      <h2>Business Readiness Assessment</h2>

      {readinessQuestions.map((q) => (
        <div key={q.id} style={{ marginBottom: 24 }}>
          <strong>{q.question}</strong>
          {q.options.map((opt, i) => (
            <div key={i}>
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

      <button onClick={handleSubmit}>Get Result</button>

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
