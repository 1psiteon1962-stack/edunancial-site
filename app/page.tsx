// /app/page.tsx

import LevelAccess from "@/components/levels/LevelAccess";
import PaymentButtons from "@/components/payments/PaymentButtons";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      {/* HERO */}
      <section>
        <h1>Edunancial</h1>

        <p style={{ fontSize: "1.1rem", marginTop: "1rem" }}>
          Financial literacy focused on readiness, structure, and long-term
          durability — for individuals, families, founders, and future builders.
        </p>

        <p style={{ marginTop: "0.75rem", color: "#555" }}>
          The platform is live. Global rollout is underway.
        </p>
      </section>

      {/* LEVEL INTRO */}
      <section style={{ marginTop: "3rem" }}>
        <h2>Your Financial Literacy Level</h2>

        <p>
          Edunancial is organized into five levels. Each level unlocks tools,
          frameworks, and access appropriate to where you are — and where
          you’re going.
        </p>
      </section>

      {/* LEVEL PREVIEW — SAFE DEFAULT */}
      <LevelAccess level={1} />

      {/* PAYMENTS PLACEHOLDER */}
      <section style={{ marginTop: "3rem" }}>
        <h3>Membership & Access</h3>

        <p>
          Payments are staged by level and region. No payment information is
          required at this time.
        </p>

        <PaymentButtons />
      </section>

      {/* FOOTER META */}
      <section style={{ marginTop: "4rem", fontSize: "0.9rem", color: "#666" }}>
        <p>Site: US-Main</p>
        <p>Region: United States</p>
        <p>Language: English</p>
        <p>Role: Primary</p>
      </section>
    </main>
  );
}
