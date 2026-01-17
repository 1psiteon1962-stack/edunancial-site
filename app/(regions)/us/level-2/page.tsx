// app/(regions)/us/level-2/page.tsx

import React from "react";
import AccessGate from "@/components/AccessGate";
import { US_LEVELS } from "@/data/us/levels";

export default function USLevel2Page() {
  const lvl = US_LEVELS.find((x) => x.code === "L2");
  if (!lvl) return null;

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 30, margin: 0 }}>{lvl.title}</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>{lvl.description}</p>

      <AccessGate required={lvl.requires ?? "starter"}>
        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            padding: 16,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 18 }}>Level 2 Content</div>
        </div>
      </AccessGate>
    </main>
  );
}
