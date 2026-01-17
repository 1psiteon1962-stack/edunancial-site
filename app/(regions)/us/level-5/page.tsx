// app/(regions)/us/level-5/page.tsx

import { US_LEVELS } from "@/data/us/levels";
import AccessGate from "@/components/AccessGate";

export default function USLevel5Page() {
  const lvl = US_LEVELS.find((l) => l.code === "level-5");

  if (!lvl) return null;

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 30, marginBottom: 4 }}>
        {lvl.title}
      </h1>

      {lvl.tagline && (
        <p style={{ marginTop: 0, opacity: 0.7 }}>
          {lvl.tagline}
        </p>
      )}

      {lvl.description && (
        <p style={{ marginTop: 12 }}>
          {lvl.description}
        </p>
      )}

      {lvl.outcomes && (
        <>
          <div style={{ fontWeight: 800, marginTop: 20 }}>
            Outcomes
          </div>

          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {lvl.outcomes.map((o) => (
              <li key={o} style={{ marginBottom: 6 }}>
                {o}
              </li>
            ))}
          </ul>
        </>
      )}

      <AccessGate required={lvl.requires}>
        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 8,
            padding: 16,
            marginTop: 24,
          }}
        >
          <h2>Level 5 Content</h2>
          <p>
            Institutional-grade capital systems, multi-entity governance,
            cross-border leverage, and long-term asset orchestration.
          </p>
        </div>
      </AccessGate>
    </main>
  );
}
