/* app/page.tsx */
"use client";

import { useEffect } from "react";

// RELATIVE IMPORTS — NO ALIASES
import LevelGate from "../components/LevelGate";
import { trackMetric } from "../lib/metrics-client";
import { resolveRegion } from "../lib/region-resolver";
import { getContent } from "../lib/content-registry";

export default function HomePage() {
  const region = resolveRegion();
  const content = getContent(region);

  useEffect(() => {
    trackMetric("page_view", { page: "home", region });
  }, [region]);

  return (
    <main className="min-h-screen bg-white text-black">
      <LevelGate requiredLevel={1}>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-4">
            {content.title}
          </h1>

          <p className="text-lg mb-6">
            {content.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.sections.map((section) => (
              <div
                key={section.id}
                className="border rounded-lg p-4 shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {section.title}
                </h2>
                <p>{section.body}</p>
              </div>
            ))}
          </div>
        </section>
      </LevelGate>
    </main>
  );
}
