'use client';

type CurriculumStep = {
  title: string;
  description: string;
};

type Props = {
  steps: CurriculumStep[];
};

export default function CurriculumPath({ steps }: Props) {
  return (
    <section className="mt-12 space-y-6">
      <h2 className="text-2xl font-semibold">Learning Path</h2>

      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li
            key={index}
            className="border-l-4 border-gray-300 pl-4"
          >
            <h3 className="font-medium">{step.title}</h3>
            <p className="text-sm text-gray-600">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
