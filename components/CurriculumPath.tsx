'use client';

export type CurriculumStep = {
  title: string;
  description: string;
};

export interface CurriculumPathProps {
  region?: string;
  steps?: CurriculumStep[];
}

const DEFAULT_STEPS: Record<string, CurriculumStep[]> = {
  africa: [
    {
      title: 'Foundations of Capital',
      description: 'Understanding informal markets, capital flow, and mobile finance systems.',
    },
    {
      title: 'Business Formation',
      description: 'Structuring micro and small enterprises for scalability and protection.',
    },
    {
      title: 'Regional Expansion',
      description: 'Cross-border trade, currency exposure, and infrastructure realities.',
    },
  ],
  mena: [
    {
      title: 'Capital Preservation',
      description: 'Risk management in volatile regulatory and geopolitical environments.',
    },
    {
      title: 'Asset Structuring',
      description: 'Holding companies, trusts, and cross-border compliance.',
    },
    {
      title: 'Growth Channels',
      description: 'Energy, logistics, and technology-driven expansion paths.',
    },
  ],
  asia: [
    {
      title: 'Manufacturing & Supply Chains',
      description: 'Understanding production leverage and export economics.',
    },
    {
      title: 'Capital Efficiency',
      description: 'High-velocity reinvestment and margin control.',
    },
    {
      title: 'Scale & Automation',
      description: 'Operational systems that support regional dominance.',
    },
  ],
};

export default function CurriculumPath({
  region,
  steps,
}: CurriculumPathProps) {
  const resolvedSteps: CurriculumStep[] =
    steps && steps.length > 0
      ? steps
      : region && DEFAULT_STEPS[region]
      ? DEFAULT_STEPS[region]
      : [];

  if (resolvedSteps.length === 0) {
    return null;
  }

  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>Curriculum Path</h2>
      <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
        {resolvedSteps.map((step, index) => (
          <li key={index} style={{ marginBottom: '1rem' }}>
            <strong>{step.title}</strong>
            <p style={{ margin: '0.25rem 0 0 0' }}>{step.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
