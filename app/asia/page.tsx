// app/asia/page.tsx

export const metadata = {
  title: "Edunancial — Asia",
  description:
    "Capital structure, discipline, and lawful wealth systems across Asia-Pacific markets, with a focus on India and Australia.",
};

export default function AsiaPage() {
  return (
    <main style={{ maxWidth: "820px", margin: "0 auto", padding: "2.5rem 1.25rem" }}>
      {/* Header */}
      <h1 style={{ fontSize: "2.2rem", marginBottom: "0.75rem" }}>
        Edunancial — Asia
      </h1>

      <p style={{ fontSize: "1.1rem", color: "#444", marginBottom: "2rem" }}>
        Capital structure, discipline, and long-term continuity across selected
        Asia-Pacific markets.
      </p>

      {/* Market Focus */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
          Primary Markets
        </h2>

        <ul style={{ paddingLeft: "1.25rem", lineHeight: "1.7" }}>
          <li>
            <strong>India</strong> — Entrepreneurial growth, real estate,
            family-owned enterprises, and expanding capital markets.
          </li>
          <li>
            <strong>Australia</strong> — Capital stability, property systems,
            pension-driven investment, and durable business governance.
          </li>
        </ul>
      </section>

      {/* Red White Blue */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
          The Red / White / Blue Framework
        </h2>

        <p style={{ marginBottom: "1rem" }}>
          Edunancial structures financial education around three lawful and
          historically proven paths toward wealth. Individuals may pursue one,
          two, or all three depending on skill, jurisdiction, and opportunity.
        </p>

        <ul style={{ paddingLeft: "1.25rem", lineHeight: "1.7" }}>
          <li>
            <strong>Red — Real Assets</strong>: Land, property, development, and
            infrastructure-linked assets.
          </li>
          <li>
            <strong>White — Paper Assets</strong>: Equities, funds, instruments,
            and market-based financial systems.
          </li>
          <li>
            <strong>Blue — Operating Businesses</strong>: Companies, services,
            trade, and productive enterprises.
          </li>
        </ul>

        <p style={{ marginTop: "1rem" }}>
          This framework does not promote speculation or shortcuts. It improves
          clarity, discipline, and decision-making across lawful systems.
        </p>
      </section>

      {/* Jurisdiction Disclaimer */}
      <section
        style={{
          borderTop: "1px solid #ddd",
          paddingTop: "1.75rem",
          marginTop: "2.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.3rem", marginBottom: "0.75rem" }}>
          Jurisdiction & Access Notice
        </h2>

        <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: "1.6" }}>
          Edunancial provides educational frameworks related to capital systems,
          ownership structures, and lawful economic activity. Content is made
          available only for jurisdictions where access to financial education,
          private enterprise, and market participation is legally permitted.
        </p>

        <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: "1.6" }}>
          The platform does not offer instruction intended to bypass local laws,
          restrictions, or regulatory frameworks. Users are responsible for
          understanding and complying with the laws applicable in their country
          or region.
        </p>
      </section>

      {/* Development Status */}
      <section style={{ marginTop: "2.5rem" }}>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          The Asia section is under active development. Additional jurisdiction-
          specific material may be added as legal, economic, and access conditions
          allow.
        </p>
      </section>
    </main>
  );
}
