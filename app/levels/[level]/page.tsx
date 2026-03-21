import AccessGate, { Plan } from '../../../components/AccessGate';

type LevelDef = {
  title: string;
  description: string;
  requiredPlan?: Plan;
};

const LEVELS: Record<string, LevelDef> = {
  free: {
    title: 'Free Level',
    description: 'Basic access',
    requiredPlan: 'free',
  },
  starter: {
    title: 'Starter Level',
    description: 'Entry tools',
    requiredPlan: 'starter',
  },
  pro: {
    title: 'Pro Level',
    description: 'Advanced tools',
    requiredPlan: 'pro',
  },
  elite: {
    title: 'Elite Level',
    description: 'High-level systems',
    requiredPlan: 'elite',
  },
  growth: {
    title: 'Growth Level',
    description: 'Scaling systems',
    requiredPlan: 'growth',
  },
  enterprise: {
    title: 'Enterprise Level',
    description: 'Full access',
    requiredPlan: 'enterprise',
  },
};

export default function LevelPage({
  params,
}: {
  params: { level: string };
}) {
  const def = LEVELS[params.level];

  if (!def) {
    return <div style={{ padding: 24 }}>Level not found</div>;
  }

  return (
    <AccessGate requiredPlan={def.requiredPlan}>
      <div style={{ padding: 24 }}>
        <h1>{def.title}</h1>
        <p>{def.description}</p>
      </div>
    </AccessGate>
  );
}
