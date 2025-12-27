"use client";

import { getEvents, Region, MetricEvent } from "@/lib/metrics";

type MetricRow = {
  pageViews: number;
  ctaClicks: number;
};

export default function MetricsDashboard() {
  const base: Record<Region, MetricRow> = {
    US: { pageViews: 0, ctaClicks: 0 },
    EU: { pageViews: 0, ctaClicks: 0 },
    AFRICA: { pageViews: 0, ctaClicks: 0 },
    LATAM: { pageViews: 0, ctaClicks: 0 },
  };

  const events: MetricEvent[] = getEvents();

  for (const e of events) {
    const row = base[e.region];
    if (e.name === "page_view") row.pageViews += 1;
    if (e.name === "cta_click") row.ctaClicks += 1;
  }

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>Metrics Dashboard</h2>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th align="left">Region</th>
            <th align="right">Page Views</th>
            <th align="right">CTA Clicks</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(base).map(([region, data]) => (
            <tr key={region}>
              <td>{region}</td>
              <td align="right">{data.pageViews}</td>
              <td align="right">{data.ctaClicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
