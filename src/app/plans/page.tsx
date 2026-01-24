// src/app/plans/page.tsx

import { PLANS } from "@/data/plans";
import type { Plan } from "@/types/plan";

export default function PlansPage() {
  return (
    <div style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 36, fontWeight: 900 }}>Plans</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Choose the access level that fits your needs.
      </p>

      <div style={{ display: "grid", gap: 16, marginTop: 24 }}>
        {PLANS.map((p: Plan) => (
          <div
            key={p.code}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>{p.name}</h2>
            <p style={{ marginTop: 6 }}>{p.description}</p>

            <div style={{ marginTop: 12, fontWeight: 900, fontSize: 20 }}>
              ${p.priceMonthlyUsd}/mo
            </div>

            <ul style={{ marginTop: 12, paddingLeft: 18 }}>
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
