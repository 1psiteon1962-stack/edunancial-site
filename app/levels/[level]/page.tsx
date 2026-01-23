import { LEVEL_DEFINITIONS } from "@/lib/level-definitions";
import AccessGate from "@/components/AccessGate";

export default function LevelPage({
  params,
}: {
  params: { level: string };
}) {
  const def = LEVEL_DEFINITIONS[params.level];

  if (!def) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Unknown Level</h1>
      </div>
    );
  }

  return (
    <AccessGate requiredPlan={def.code}>
      <div style={{ padding: 24 }}>
        <h1>{def.name}</h1>
        <p>{def.description}</p>
      </div>
    </AccessGate>
  );
}
