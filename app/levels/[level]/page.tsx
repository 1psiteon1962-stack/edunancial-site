// app/levels/[level]/page.tsx

import AccessGate from "@/components/AccessGate";
import { LEVEL_DEFINITIONS } from "@/lib/level-definitions";

export default function LevelPage({ params }: { params: { level: string } }) {
  const def = LEVEL_DEFINITIONS[params.level];

  if (!def) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Level Not Found</h1>
        <p>The requested level does not exist.</p>
      </div>
    );
  }

  return (
    <AccessGate required={def.code}>
      <div style={{ padding: 24 }}>
        <h1>{def.name}</h1>
        <p>{def.description}</p>
      </div>
    </AccessGate>
  );
}
