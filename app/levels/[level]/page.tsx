// app/levels/[level]/page.tsx

import { notFound } from "next/navigation";
import { LEVEL_DEFINITIONS } from "@/data/levels";

export default function LevelPage({
  params,
}: {
  params: { level: string };
}) {
  const levelIndex = Number(params.level);

  if (Number.isNaN(levelIndex)) {
    return notFound();
  }

  const def = LEVEL_DEFINITIONS[levelIndex];

  if (!def) {
    return notFound();
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{def.title}</h1>
      <p>{def.description}</p>
    </main>
  );
}
