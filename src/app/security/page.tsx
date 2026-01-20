// src/app/security/page.tsx

import { US_SECURITY } from "@/data/security/us.security";

export default function SecurityPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Security</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Region: {US_SECURITY.region.toUpperCase()} • Last updated:{" "}
        {new Date(US_SECURITY.lastUpdatedISO).toLocaleString()}
      </p>

      <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
        {US_SECURITY.items.map((it) => (
          <section
            key={it.title}
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 800 }}>{it.title}</div>
            <div style={{ marginTop: 6, opacity: 0.85 }}>{it.summary}</div>
          </section>
        ))}
      </div>
    </main>
  );
}
