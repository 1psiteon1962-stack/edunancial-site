"use client";

import { useState } from "react";
import { DIAGNOSTIC_QUESTIONS } from "@/lib/diagnostic-questions";
import { scoreDiagnostic } from "@/lib/diagnostic-engine";
import { useRouter } from "next/navigation";

export default function DiagnosticPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const router = useRouter();

  function submit() {
    const level = scoreDiagnostic(answers);
    router.push(`/levels/level-${level}`);
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Financial Thinking Diagnostic
      </h1>

      {DIAGNOSTIC_QUESTIONS.map(q => (
        <div key={q.id} className="mb-4">
          <label className="block font-medium mb-2">
            {q.prompt}
          </label>
          <select
            className="border p-2 w-full"
            onChange={e =>
              setAnswers({
                ...answers,
                [q.id]: Number(e.target.value)
              })
            }
          >
            <option value="0">Select</option>
            <option value="1">Not at all</option>
            <option value="2">Somewhat</option>
            <option value="3">Comfortable</option>
            <option value="4">Very comfortable</option>
          </select>
        </div>
      ))}

      <button
        onClick={submit}
        className="mt-6 bg-black text-white px-6 py-2 rounded"
      >
        See My Starting Level
      </button>
    </main>
  );
}
