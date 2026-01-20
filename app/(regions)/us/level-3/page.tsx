import { Levels } from "../../../../data/levels";
import { AccessGate } from "@/components/AccessGate";

export default function LevelThreePage() {
  const lvl = Levels[3];

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 30 }}>{lvl.name}</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>{lvl.description}</p>

      <AccessGate required="starter">
        <div style={{ marginTop: 24 }}>
          <p>Welcome to Level 3 tools.</p>
        </div>
      </AccessGate>
    </main>
  );
}
