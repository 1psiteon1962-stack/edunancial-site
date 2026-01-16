"use client";

import AccessGate from "@/app/(regions)/us/components/AccessGate";

const card: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 24,
  background: "#ffffff",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

export default function USAppsPage() {
  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 32 }}>
        Edunancial Applications
      </h1>

      {/* FREE TIER */}
      <AccessGate required="free">
        <div style={card}>
          <h2>Free Tools</h2>
          <p>Public tools available to all users.</p>
        </div>
      </AccessGate>

      {/* STARTER TIER */}
      <AccessGate required="starter">
        <div style={card}>
          <h2>Starter Tools</h2>
          <p>Basic financial tools for early-stage builders.</p>
        </div>
      </AccessGate>

      {/* FOUNDER TIER — THIS IS THE FIX */}
      <AccessGate required="founder">
        <div style={card}>
          <h2>Founder Tools</h2>
          <p>Full business-grade applications for serious founders.</p>
        </div>
      </AccessGate>

      {/* PRO TIER */}
      <AccessGate required="pro">
        <div style={card}>
          <h2>Professional Suite</h2>
          <p>Advanced financial modeling and scaling systems.</p>
        </div>
      </AccessGate>

      {/* ELITE TIER */}
      <AccessGate required="elite">
        <div style={card}>
          <h2>Elite Platform</h2>
          <p>Institutional-grade capital, legal, and investment tools.</p>
        </div>
      </AccessGate>
    </div>
  );
}
