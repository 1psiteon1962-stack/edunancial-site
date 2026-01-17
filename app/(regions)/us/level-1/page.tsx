// app/(regions)/us/level-1/page.tsx

import React from "react";
import AccessGate from "@/components/AccessGate";
import { US_LEVELS } from "@/data/us/levels";

export default function USLevel1Page() {
  const lvl = US_LEVELS.find((x) => x.code === "L1");
  if (!lvl) return null;

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 30, margin: 0 }}>{lvl.title}</h1>
      <p style={{ marginTop: 8, opacity: 0.85 }}>{lvl.description}</p>

      <AccessGate required={lvl.requires ?? "free"}>
        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            padding: 16,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 18 }}>Level 1 Content</div>
          <p style={{ marginTop: 8, opacity: 0.85 }}>
            This is gated by your plan.
          </p>
        </div>
      </AccessGate>
    </main>
  );
}
