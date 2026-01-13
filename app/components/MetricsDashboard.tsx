"use client";

import { useMemo, useState } from "react";

type MetricRow = {
  label: string;
  value: number;
};

export default function MetricsDashboard() {
  const [dailyVisitors, setDailyVisitors] = useState<number>(1200);
  const [conversionRate, setConversionRate] = useState<number>(0.012);
  const [avgAnnualSpend, setAvgAnnualSpend] = useState<number>(59.88); // 4.99*12 baseline example
  const [churn, setChurn] = useState<number>(0.06);

  const model = useMemo(() => {
    const buyersPerDay = dailyVisitors * conversionRate;
    const annualBuyers = buyersPerDay * 365;
    const annualRevenue = annualBuyers * avgAnnualSpend;
    return { buyersPerDay, annualBuyers, annualRevenue };
  }, [dailyVisitors, conversionRate, avgAnnualSpend]);

  const box: React.CSSProperties = {
    border: "1px solid #e5e5e5",
    borderRadius: 14,
    padding: 14,
  };

  const rows: MetricRow[] = [
    { label: "Estimated Buyers / Day", value: model.buyersPerDay },
    { label: "Estimated Buyers / Year", value: model.annualBuyers },
    { label: "Estimated Revenue / Year", value: model.annualRevenue },
  ];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={box}>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>Inputs (Editable)</div>

        <label style={{ display: "block", marginBottom: 10 }}>
          <div style={{ fontWeight: 700 }}>Daily Visitors</div>
          <input
            value={dailyVisitors}
            onChange={(e) => setDailyVisitors(Number(e.target.value || 0))}
            type="number"
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 10 }}>
          <div style={{ fontWeight: 700 }}>Conversion Rate (0–1)</div>
          <input
            value={conversionRate}
            onChange={(e) => setConversionRate(Number(e.target.value || 0))}
            type="number"
            step="0.001"
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 10 }}>
          <div style={{ fontWeight: 700 }}>Average Annual Spend (USD)</div>
          <input
            value={avgAnnualSpend}
            onChange={(e) => setAvgAnnualSpend(Number(e.target.value || 0))}
            type="number"
            step="0.01"
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 0 }}>
          <div style={{ fontWeight: 700 }}>Monthly Churn (0–1)</div>
          <input
            value={churn}
            onChange={(e) => setChurn(Number(e.target.value || 0))}
            type="number"
            step="0.01"
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>
      </div>

      <div style={box}>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>Outputs</div>
        <div style={{ display: "grid", gap: 10 }}>
          {rows.map((r) => (
            <div
              key={r.label}
              style={{ display: "flex", justifyContent: "space-between", gap: 12, paddingBottom: 10, borderBottom: "1px solid #eee" }}
            >
              <div style={{ fontWeight: 700 }}>{r.label}</div>
              <div style={{ fontWeight: 800 }}>
                {r.label.includes("Revenue")
                  ? `$${r.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  : r.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10, opacity: 0.85 }}>
          Churn (monthly) currently set to <b>{(churn * 100).toFixed(1)}%</b>. (This is displayed for tracking; you can wire it to retention later.)
        </div>
      </div>
    </div>
  );
}
