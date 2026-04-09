"use client";

import { useState } from "react";
import { DIAGNOSTIC_QUESTIONS } from "../../diagnostic-questions";
import { scoreDiagnostic } from "../../diagnostic-engine";
import { useRouter } from "next/navigation";

export default function DiagnosticPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const router = useRouter();

  const handleAnswer = (id: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const score = scoreDiagnostic(answers);
    router.push(`/result?score=${score}`);
  };

  return (
    <main style={{ padding: "40px" }}>
      <h1>Diagnostic</h1>

      {DIAGNOSTIC_QUESTIONS.map((q) => (
        <div key={q.id} style={{ marginBottom: "20px" }}>
          <p>{q.question}</p>

          {q.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleAnswer(q.id, opt.value)}
              style={{ marginRight: "10px" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit}>Submit</button>
    </main>
  );
}
