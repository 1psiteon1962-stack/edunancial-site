'use client';

import { useState } from 'react';

export default function CapitalismAssessment() {
  const [score, setScore] = useState<number | null>(null);

  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>Capital Readiness Assessment</h2>
      <button onClick={() => setScore(72)}>
        Run Assessment
      </button>

      {score !== null && (
        <p style={{ marginTop: '1rem' }}>
          Estimated readiness score: {score}
        </p>
      )}
    </section>
  );
}
