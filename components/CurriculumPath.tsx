// components/CurriculumPath.tsx

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
    <section className="mt-8">
      <h2 className="text-xl font-semibold">
        Curriculum Path {region ? `– ${region}` : ''}
      </h2>

      <ul className="mt-4 space-y-4">
        {steps.map((step, index) => (
          <li key={index}>
            <strong>{step.title}</strong>
            <p>{step.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
