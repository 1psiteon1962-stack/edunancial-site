// app/page.tsx
import { headers } from "next/headers";
import { CONTENT_REGISTRY } from "@/lib/content-registry";
import { resolveRegion } from "@/lib/region-resolver";
import LevelGate from "@/components/LevelGate";

export default function HomePage() {
  const headersList = headers();
  const host = headersList.get("host") || undefined;

  const region = resolveRegion(host);
  const content = CONTENT_REGISTRY[region];

  return (
    <main style={{ padding: "3rem", fontFamily: "system-ui, sans-serif" }}>
      {/* HERO — LEVEL 1 */}
      <section>
        <h1>{content.hero.title}</h1>
        <p>{content.hero.body}</p>
      </section>

      {/* MISSION — LEVEL 1 */}
      <section style={{ marginTop: "2rem" }}>
        <h2>{content.mission.title}</h2>
        <p>{content.mission.body}</p>
      </section>

      {/* INTERMEDIATE — LEVEL 2 */}
      <LevelGate requiredLevel={2} region={region}>
        <section style={{ marginTop: "3rem" }}>
          <h2>Building Financial Structure</h2>
          <p>
            Credit, cashflow discipline, early investing logic,
            and risk awareness.
          </p>
        </section>
      </LevelGate>

      {/* ADVANCED — LEVEL 3 */}
      <LevelGate requiredLevel={3} region={region}>
        <section style={{ marginTop: "3rem" }}>
          <h2>Operating Capital</h2>
          <p>
            Business entities, leverage, scaling systems,
            and operational risk.
          </p>
        </section>
      </LevelGate>

      {/* STRATEGIC — LEVEL 4 */}
      <LevelGate requiredLevel={4} region={region}>
        <section style={{ marginTop: "3rem" }}>
          <h2>Wealth Strategy</h2>
          <p>
            Tax efficiency, cross-border thinking,
            asset protection, governance.
          </p>
        </section>
      </LevelGate>

      {/* ELITE — LEVEL 5 */}
      <LevelGate requiredLevel={5} region={region}>
        <section style={{ marginTop: "3rem" }}>
          <h2>Capital Architecture</h2>
          <p>
            Investor structures, private equity logic,
            institutional frameworks, legacy planning.
          </p>
        </section>
      </LevelGate>
    </main>
  );
}
