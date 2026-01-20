// src/app/regions/page.tsx

import Link from "next/link";
import { REGIONS } from "@/data/regions";

export default function RegionsPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Regions</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Select your region experience.
      </p>

      <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
        {REGIONS.map((r) => (
          <Link
            key={r.code}
            href={r.path}
            style={{
              display: "block",
              padding: 14,
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.12)",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 800 }}>{r.name}</div>
            <div style={{ marginTop: 6, opacity: 0.85 }}>{r.description}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
