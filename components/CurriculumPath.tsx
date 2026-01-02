// components/CurriculumPath.tsx

import React from 'react';

export type CurriculumStep = {
  title: string;
  description: string;
};

interface CurriculumPathProps {
  region?: string;
  steps?: CurriculumStep[];
}

export default function CurriculumPath({
  region,
  steps = [],
}: CurriculumPathProps) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">
        Curriculum Path {region ? `— ${region.toUpperCase()}` : ''}
      </h2>

      <ul className="pl-6 list-disc">
        {steps.map((step, index) => (
          <li key={index} className="mb-4">
            <strong>{step.title}</strong>
            <p className="text-sm mt-1">{step.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
