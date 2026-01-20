// src/app/plans/page.tsx

import { US_PLANS } from "@/data/plans/us.plans";

export default function PlansPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Plans</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Choose the tier that matches your current level.
      </p>

      <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
        {US_PLANS.map((p) => (
          <section
            key={p.code}
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>{p.name}</h2>
                <div style={{ marginTop: 6, opacity: 0.85 }}>{p.description}</div>
              </div>
              <div style={{ fontWeight: 800, whiteSpace: "nowrap" }}>
                ${p.priceMonthlyUsd}/mo
              </div>
            </div>

            <ul style={{ marginTop: 12, paddingLeft: 18 }}>
              {p.features.map((f) => (
                <li key={f} style={{ marginBottom: 6 }}>
                  {f}
                </li>
              ))}
            </ul>

            <button
              style={{
                marginTop: 10,
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
                fontWeight: 700,
                cursor: "pointer",
                background: "transparent",
              }}
            >
              {p.ctaLabel}
            </button>
          </section>
        ))}
      </div>
    </main>
  );
}
