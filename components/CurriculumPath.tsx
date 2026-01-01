'use client';

import React from 'react';

export type CurriculumStep = {
  title: string;
  description: string;
};

export interface CurriculumPathProps {
  steps: CurriculumStep[];
}

export default function CurriculumPath({ steps }: CurriculumPathProps) {
  return (
    <section className="curriculum-path">
      <h2>Curriculum Path</h2>
      <ol>
        {steps.map((step, index) => (
          <li key={index}>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
