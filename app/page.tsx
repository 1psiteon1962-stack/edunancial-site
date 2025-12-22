"use client";

import { useEffect } from "react";
import { resolveRegion } from "../lib/region-resolver";
import { getContent } from "../lib/content-registry";
import { trackMetric } from "../lib/metrics-client";

export default function HomePage() {
  const region = resolveRegion();
  const content = getContent(region);

  useEffect(() => {
    trackMetric("page_view", { page: "home", region });
  }, [region]);

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
      <p className="text-lg">{content.description}</p>
    </section>
  );
}
