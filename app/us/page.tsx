// app/us/page.tsx

import { REGIONS } from "@/lib/regions.config";

const region = REGIONS["us"];

export default function USHomePage() {
  return (
    <main style={{ padding: "2.5rem", maxWidth: "1100px", margin: "0 auto" }}>
      
      {/* HERO */}
      <section style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 700 }}>
          Edunancial
        </h1>
        <p style={{ fontSize: "1.25rem", marginTop: "1rem", maxWidth: "720px" }}>
          Education focused on readiness, structure, and long-term business durability.
        </p>
        <p style={{ marginTop: "1rem", color: "#555" }}>
          The platform is live. U.S. operations are active.
        </p>
      </section>

      {/* WHAT WE PROVIDE */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>
          What Edunancial Provides
        </h2>
        <ul style={{ lineHeight: "1.8", paddingLeft: "1.25rem" }}>
          <li>Structured business and financial readiness education</li>
          <li>Durable frameworks for founders, operators, and investors</li>
          <li>Real-world alignment with legal, tax, and operational realities</li>
          <li>Curriculum designed for scalability, not theory</li>
          <li>Global architecture with region-specific execution</li>
        </ul>
      </section>

      {/* U.S. POSITIONING */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>
          United States Platform
        </h2>
        <p style={{ maxWidth: "760px" }}>
          The U.S. platform serves as the primary launch environment for Edunancial.
          All core systems, curriculum structures, and operational models are validated
          here before international expansion.
        </p>
      </section>

      {/* STATUS BLOCK */}
      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1.5rem",
          background: "#fafafa",
        }}
      >
        <strong>Platform Status</strong>
        <ul style={{ marginTop: "0.75rem", lineHeight: "1.7" }}>
          <li>Region: United States</li>
          <li>Languages: English, Spanish</li>
          <li>Deployment: Active</li>
          <li>Expansion: In progress</li>
        </ul>
      </section>

      {/* FOOTER DISCLAIMER */}
      <footer style={{ marginTop: "4rem", fontSize: "0.85rem", color: "#666" }}>
        <p>
          Edunancial provides educational resources only. Nothing on this site
          constitutes legal, financial, or tax advice.
        </p>
      </footer>

    </main>
  );
}
