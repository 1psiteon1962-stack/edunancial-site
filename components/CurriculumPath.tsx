'use client';

import React from 'react';

export type CurriculumStep = {
  title: string;
  description: string;
};

interface CurriculumPathProps {
  steps?: CurriculumStep[];
  region?: string;
}

export default function CurriculumPath({
  steps = [],
  region
}: CurriculumPathProps) {
  const resolvedSteps: CurriculumStep[] = Array.isArray(steps) ? steps : [];

  return (
    <section style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Curriculum Path {region ? `— ${region.toUpperCase()}` : ''}
      </h2>

      <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
        {resolvedSteps.map((step, index) => (
          <li key={index} style={{ marginBottom: '1rem' }}>
            <strong>{step.title}</strong>
            <p style={{ margin: '0.25rem 0 0 0' }}>
              {step.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
