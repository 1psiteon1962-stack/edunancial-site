'use client';

import React, { useState } from 'react';

const QUESTIONS = [
  'Do you understand how capital moves across borders?',
  'Can you identify regulatory risk before entering a market?',
  'Do you structure businesses for long-term scalability?',
];

export default function CapitalismAssessment() {
  const [index, setIndex] = useState(0);

  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>Capital Readiness Assessment</h2>
      <p>{QUESTIONS[index]}</p>

      <button
        onClick={() => setIndex((i) => (i + 1) % QUESTIONS.length)}
        style={{ marginTop: '1rem' }}
      >
        Next
      </button>
    </section>
  );
}
