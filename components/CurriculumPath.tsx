'use client';

import React from 'react';

type CurriculumStep = {
  title: string;
  description: string;
};

type CurriculumPathProps = {
  region: string;
};

const PATHS: Record<string, CurriculumStep[]> = {
  mena: [
    {
      title: 'Foundations of Capital & Trade',
      description:
        'Introduction to capital flow, regional trade dynamics, and economic structures specific to MENA markets.',
    },
    {
      title: 'Regulation, Compliance, and Risk',
      description:
        'Understanding sovereign risk, Sharia-compliant finance considerations, and cross-border compliance.',
    },
    {
      title: 'Scaling Across Borders',
      description:
        'Building entities and partnerships that operate across MENA, Europe, and Asia.',
    },
  ],
};

export default function CurriculumPath({ region }: CurriculumPathProps) {
  const steps = PATHS[region] || [];

  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>Curriculum Path</h2>
      <ul>
        {steps.map((step, index) => (
          <li key={index} style={{ marginBottom: '1rem' }}>
            <strong>{step.title}</strong>
            <p>{step.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
