// src/app/plans/page.tsx

import { PLANS } from "@/data/plans";

export default function PlansPage() {
  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 36, fontWeight: 900 }}>Plans</h1>

      <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
        {PLANS.map((p) => (
          <div
            key={p.code}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>{p.name}</h2>
            <p>{p.description}</p>

            <div style={{ marginTop: 10, fontWeight: 900 }}>
              ${p.priceMonthlyUsd}/mo
            </div>

            <ul style={{ marginTop: 10 }}>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
