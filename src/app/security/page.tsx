// src/app/security/page.tsx

import React from "react";
import { US_SECURITY } from "@/data/security/us-security";

export default function SecurityPage() {
  const lastUpdated = new Date(US_SECURITY.lastUpdated);
  const formattedLastUpdated = lastUpdated.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>Security & Compliance</h1>

      <p style={{ marginTop: 8, opacity: 0.7 }}>
        Region: {US_SECURITY.region.toUpperCase()} • {formattedLastUpdated}
      </p>

      <div style={{ marginTop: 24 }}>
        {US_SECURITY.items.map((item) => (
          <section key={item.id} style={{ marginBottom: 24 }}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
