import { notFound } from "next/navigation";
import AccessGate from "@/components/AccessGate";
import { LEVEL_DEFINITIONS } from "@/constants/levels";

export default function LevelPage({
  params,
}: {
  params: { level: string };
}) {
  const levelIndex = Number(params.level) - 1;

  const def = LEVEL_DEFINITIONS[levelIndex];

  if (!def) return notFound();

  return (
    <AccessGate requiredPlan={def.requiredPlan}>
      <div style={{ padding: 24 }}>
        <h1>{def.title}</h1>
        <p>{def.description}</p>
      </div>
    </AccessGate>
  );
}
