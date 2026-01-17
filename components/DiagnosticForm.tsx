"use client";

import { useState } from "react";
import {
  diagnosticQuestions,
  evaluateDiagnostic,
  type ThinkingLevel,
} from "@/lib/diagnostic";

type Props = {
  onComplete: (level: ThinkingLevel) => void;
};

export default function DiagnosticForm({ onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  function handleSelect(questionId: string, weight: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: weight }));
  }

  function handleSubmit() {
    const result = evaluateDiagnostic(answers);
    onComplete(result.level);
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold">
        Financial Thinking Diagnostic
      </h2>

      {diagnosticQuestions.map((q) => (
        <div key={q.id} className="space-y-2">
          <p className="font-medium">{q.prompt}</p>
          <div className="space-y-1">
            {q.options.map((opt, idx) => (
              <label
                key={idx}
                className="block cursor-pointer border rounded p-2 hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name={q.id}
                  className="mr-2"
                  onChange={() => handleSelect(q.id, opt.weight)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-black text-white rounded"
      >
        Continue
      </button>
    </div>
  );
}
