// app/(regions)/us/level-3/page.tsx

import { US_LEVELS } from "@/data/us/levels";
import AccessGate from "@/components/AccessGate";

export default function USLevel3Page() {
  const level = US_LEVELS.find((l) => l.code === "level-3");

  if (!level) return null;

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 30, marginBottom: 4 }}>
        {level.title}
      </h1>

      {level.tagline && (
        <p style={{ marginTop: 0, opacity: 0.7 }}>
          {level.tagline}
        </p>
      )}

      {level.description && (
        <p style={{ marginTop: 12 }}>
          {level.description}
        </p>
      )}

      <AccessGate required={level.requires}>
        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 8,
            padding: 16,
            marginTop: 24,
          }}
        >
          <h2>Level 3 Content</h2>
          <p>
            Advanced execution tools, strategy layers, and optimization modules
            live here.
          </p>
        </div>
      </AccessGate>
    </main>
  );
}
