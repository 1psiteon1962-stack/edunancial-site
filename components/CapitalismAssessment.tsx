'use client';

import { useState } from 'react';

export default function CapitalismAssessment() {
  const [score, setScore] = useState<number | null>(null);

  return (
    <section className="mt-12 space-y-4">
      <h2 className="text-2xl font-semibold">
        Economic Readiness Snapshot
      </h2>

      <p className="text-sm text-gray-600">
        This self-evaluation helps frame economic systems,
        incentives, and market exposure.
      </p>

      <button
        onClick={() => setScore(72)}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Run Assessment
      </button>

      {score !== null && (
        <p className="text-sm text-gray-700">
          Indicative Readiness Score: <strong>{score}%</strong>
        </p>
      )}
    </section>
  );
}
