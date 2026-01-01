'use client';

import { useState } from 'react';

export default function CapitalismAssessment() {
  const [score, setScore] = useState<number | null>(null);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">
        Capital Discipline Self-Check
      </h2>

      <button
        onClick={() => setScore(72)}
        className="px-4 py-2 border rounded"
      >
        Run Assessment
      </button>

      {score !== null && (
        <p className="mt-4">
          Your readiness score: <strong>{score}</strong>
        </p>
      )}
    </section>
  );
}
