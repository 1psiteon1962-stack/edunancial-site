"use client";

import { getEvents, Region, MetricEvent } from "@/lib/metrics";

type Props = {
  region: Region;
};

export default function RecommendationsPanel({ region }: Props) {
  const events: MetricEvent[] = getEvents().filter(
    (e) => e.region === region
  );

  let recommendation = "Keep building consistently.";

  const pageViews = events.filter((e) => e.name === "page_view").length;
  const ctaClicks = events.filter((e) => e.name === "cta_click").length;

  if (pageViews > 10 && ctaClicks === 0) {
    recommendation =
      "High attention, low conversion. Improve your CTA clarity.";
  }

  if (ctaClicks > 3) {
    recommendation =
      "Strong engagement. Consider offering an upsell or next module.";
  }

  return (
    <section style={{ marginTop: "2rem" }}>
      <h3>Recommendations</h3>
      <p>{recommendation}</p>
    </section>
  );
}
