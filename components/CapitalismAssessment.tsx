'use client';

import { useState } from 'react';

export default function CapitalismAssessment() {
  const [score, setScore] = useState<number | null>(null);

  return (
    <section>
      <h3>Capital Readiness Check</h3>

      <button onClick={() => setScore(1)}>Beginner</button>
      <button onClick={() => setScore(2)}>Intermediate</button>
      <button onClick={() => setScore(3)}>Advanced</button>

      {score && <p>Your current capital discipline level: {score}</p>}
    </section>
  );
}
