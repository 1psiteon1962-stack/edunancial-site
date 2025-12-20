import LevelsOverview from "@/components/LevelsOverview";
import LevelGate from "@/components/LevelGate";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Edunancial</h1>

      <p>
        A financial literacy platform focused on readiness, structure,
        ownership, and long-term capital durability.
      </p>

      <p>
        This is the U.S. primary site. Global mirror sites follow the same
        governance model.
      </p>

      <LevelsOverview />

      {/* LEVEL 1 — PUBLIC */}
      <LevelGate level={1}>
        <section>
          <h2>Level 1: Foundation</h2>
          <p>Money discipline, awareness, and basic financial logic.</p>
        </section>
      </LevelGate>

      {/* LEVEL 2 — PUBLIC */}
      <LevelGate level={2}>
        <section>
          <h2>Level 2: Structure</h2>
          <p>Income systems, business thinking, and organization.</p>
        </section>
      </LevelGate>

      {/* LEVEL 3 — LOCKED */}
      <LevelGate level={3}>
        <section>
          <h2>Level 3: Ownership</h2>
          <p>Entities, assets, and protection strategy.</p>
        </section>
      </LevelGate>

      {/* LEVEL 4 — LOCKED */}
      <LevelGate level={4}>
        <section>
          <h2>Level 4: Scale</h2>
          <p>Capital leverage and expansion mechanics.</p>
        </section>
      </LevelGate>

      {/* LEVEL 5 — LOCKED */}
      <LevelGate level={5}>
        <section>
          <h2>Level 5: Capital Architect</h2>
          <p>Governance, systems, and legacy design.</p>
        </section>
      </LevelGate>
    </main>
  );
}
