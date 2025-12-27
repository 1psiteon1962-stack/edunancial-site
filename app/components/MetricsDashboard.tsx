"use client";

type Region = "US" | "EU" | "AFRICA" | "LATAM";

type MetricEventName = "page_view" | "cta_click";

type MetricEvent = {
  region: Region;
  name: MetricEventName;
};

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

  // TEMPORARY PLACEHOLDER DATA
  // Later this can come from cookies, localStorage, DB, etc.
  const events: MetricEvent[] = [
    { region: "AFRICA", name: "page_view" },
    { region: "AFRICA", name: "cta_click" },
    { region: "LATAM", name: "page_view" },
    { region: "US", name: "page_view" },
  ];

  for (const e of events) {
    const row = base[e.region];
    if (e.name === "page_view") row.pageViews += 1;
    if (e.name === "cta_click") row.ctaClicks += 1;
  }

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>Metrics Dashboard</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1rem",
        }}
      >
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
