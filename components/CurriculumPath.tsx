// components/CurriculumPath.tsx
'use client';

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
      <h2 className="text-2xl font-semibold mb-6">
        Curriculum Path {region ? `– ${region.toUpperCase()}` : ''}
      </h2>

      <ul className="space-y-6">
        {steps.map((step, index) => (
          <li key={index}>
            <strong className="block text-lg">{step.title}</strong>
            <p className="text-gray-700">{step.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
