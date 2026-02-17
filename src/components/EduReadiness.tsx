"use client";

import { useState } from "react";

type Answers = Record<string, number>;

type ReadinessResult = {
  level: string;
  score: number;
};

function calculateReadinessScore(answers: Answers): ReadinessResult {
  const values = Object.values(answers);
  const score = values.reduce((sum, v) => sum + v, 0);

  let level = "Beginner";
  if (score >= 70) level = "Advanced";
  else if (score >= 40) level = "Intermediate";

  return { level, score };
}

export default function EduReadiness() {
  const [answers, setAnswers] = useState<Answers>({
    discipline: 0,
    systems: 0,
    execution: 0,
  });

  function handleChange(key: string, value: number) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    const result = calculateReadinessScore(answers);
    alert(`Readiness level: ${result.level} (score: ${result.score})`);
  }

  return (
    <section style={{ padding: "2rem" }}>
      <h2>Education Readiness</h2>

      <label>
        Discipline:
        <input
          type="number"
          min={0}
          max={50}
          value={answers.discipline}
          onChange={(e) => handleChange("discipline", Number(e.target.value))}
        />
      </label>

      <br />

      <label>
        Systems:
        <input
          type="number"
          min={0}
          max={50}
          value={answers.systems}
          onChange={(e) => handleChange("systems", Number(e.target.value))}
        />
      </label>

      <br />

      <label>
        Execution:
        <input
          type="number"
          min={0}
          max={50}
          value={answers.execution}
          onChange={(e) => handleChange("execution", Number(e.target.value))}
        />
      </label>

      <br /><br />

      <button onClick={handleSubmit}>Check Readiness</button>
    </section>
  );
}
