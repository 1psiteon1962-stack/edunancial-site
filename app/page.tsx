// app/page.tsx
"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/metrics-client";
import { resolveRegion } from "@/lib/region-resolver";
import LevelGate from "@/components/LevelGate";
import { CONTENT_REGISTRY } from "@/lib/content-registry";

export default function HomePage() {
  const region = resolveRegion(undefined);
  const content = CONTENT_REGISTRY[region];

  useEffect(() => {
    trackEvent("visit", region);
  }, [region]);

  return (
    <main style={{ padding: "3rem" }}>
      <h1>{content.hero.title}</h1>
      <p>{content.hero.body}</p>

      <LevelGate requiredLevel={2} region={region}>
        <h2>Level 2 Content</h2>
      </LevelGate>

      <LevelGate requiredLevel={3} region={region}>
        <h2>Level 3 Content</h2>
      </LevelGate>

      <LevelGate requiredLevel={4} region={region}>
        <h2>Level 4 Content</h2>
      </LevelGate>

      <LevelGate requiredLevel={5} region={region}>
        <h2>Level 5 Content</h2>
      </LevelGate>
    </main>
  );
}
