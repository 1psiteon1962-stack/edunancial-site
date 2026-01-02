// components/CurriculumPath.tsx

import React from 'react';

export type CurriculumStep = {
  title: string;
  description: string;
};

export interface CurriculumPathProps {
  region?: string;
  steps?: CurriculumStep[];
}

const DEFAULT_STEPS: CurriculumStep[] = [
  {
    title: 'Foundations',
    description: 'Understanding markets, incentives, and value creation.',
  },
  {
    title: 'Structure',
    description: 'Legal entities, ownership, and governance.',
  },
  {
    title: 'Capital',
    description: 'Saving, investing, and capital formation.',
  },
  {
    title: 'Scale',
    description: 'Systems, leverage, and long-term growth.',
  },
];

export default function CurriculumPath({
  region,
  steps,
}: CurriculumPathProps) {
  const stepsToRender: CurriculumStep[] = steps ?? DEFAULT_STEPS;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">
        Curriculum Path {region ? `— ${region.toUpperCase()}` : ''}
      </h2>

      <ul className="list-disc pl-6 space-y-4">
        {stepsToRender.map((step, index) => (
          <li key={index}>
            <strong>{step.title}</strong>
            <p className="text-sm text-gray-700">{step.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
