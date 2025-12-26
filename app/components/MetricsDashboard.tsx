"use client";

import { useMemo, useState } from "react";
import { Region } from "@/lib/core";
import { clearEvents, getEvents, MetricEvent } from "@/lib/metrics";

type Row = {
  region: Region;
  pageViews: number;
  ctaClicks: number;
  leads: number;
  moduleOpens: number;
  cashflowSubmits: number;
};

function summarize(events: MetricEvent[]): Row[] {
  const regions: Region[] = ["US", "LATAM", "AFRICA", "EU", "MENA"];
  const base: Record<Region, Row> = Object.fromEntries(
    regions.map((r) => [
      r,
      { region: r, pageViews: 0, ctaClicks: 0, leads: 0, moduleOpens: 0, cashflowSubmits: 0 },
    ])
  ) as Record<Region, Row>;

  for (const e of events) {
    const row = base[e.region];
    if (!row) continue;
    if (e.name === "page_view") row.pageViews += 1;
    if (e.name === "cta_click") row.ctaClicks += 1;
    if (e.name === "lead_submit") row.leads += 1;
    if (e.name === "module_open") row.moduleOpens += 1;
    if (e.name === "cashflow_submit") row.cashflowSubmits += 1;
  }

  return regions.map((r) => base[r]);
}

export default function MetricsDashboard() {
  const [tick, setTick] = useState(0);

  const rows = useMemo(() => summarize(getEvents()), [tick]);

  return (
    <section style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: 10 }}>
      <h2>Metrics Dashboard (Local)</h2>
      <p style={{ marginTop: 0, opacity: 0.85 }}>
        This is local-device analytics (proof of concept). Later we can route to a database.
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Region</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Views</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>CTA</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Leads</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Modules</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Cash-Flow</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.region}>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{r.region}</td>
              <td style={{ textAlign: "center", padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{r.pageViews}</td>
              <td style={{ textAlign: "center", padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{r.ctaClicks}</td>
              <td style={{ textAlign: "center", padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{r.leads}</td>
              <td style={{ textAlign: "center", padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{r.moduleOpens}</td>
              <td style={{ textAlign: "center", padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{r.cashflowSubmits}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={() => setTick((x) => x + 1)}>Refresh</button>
        <button
          onClick={() => {
            clearEvents();
            setTick((x) => x + 1);
            alert("Cleared local metrics.");
          }}
        >
          Clear
        </button>
      </div>
    </section>
  );
}
