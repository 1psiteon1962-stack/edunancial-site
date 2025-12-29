// app/mena/page.tsx

export const metadata = {
  title: "Edunancial — MENA",
  description:
    "Financial structure, discipline, and lawful capital systems across the Middle East and North Africa.",
};

export default function MENAPage() {
  return (
    <main style={{ maxWidth: "820px", margin: "0 auto", padding: "2.5rem 1.25rem" }}>
      {/* Language Selector */}
      <div style={{ marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        <a href="/mena?lang=ar">AR</a> |{" "}
        <a href="/mena?lang=en">EN</a> |{" "}
        <a href="/mena?lang=fr">FR</a>
      </div>

      <h1 style={{ fontSize: "2.2rem", marginBottom: "0.75rem" }}>
        Edunancial — MENA
      </h1>

      <p style={{ fontSize: "1.1rem", color: "#444", marginBottom: "2rem" }}>
        Financial structure, discipline, and long-term continuity.
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <p>
          Edunancial focuses on capital systems, governance, and durable financial
          strategies across the Middle East and North Africa.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
          Red / White / Blue Framework
        </h2>

        <ul style={{ paddingLeft: "1.25rem", lineHeight: "1.7" }}>
          <li>
            <strong>Red</strong> — Real assets and property-based ownership
          </li>
          <li>
            <strong>White</strong> — Financial instruments and capital markets
          </li>
          <li>
            <strong>Blue</strong> — Operating businesses and productive enterprise
          </li>
        </ul>
      </section>

      <section style={{ borderTop: "1px solid #ddd", paddingTop: "1.75rem" }}>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          Content is educational only and intended for jurisdictions where private
          enterprise and capital participation are legally permitted.
        </p>
      </section>
    </main>
  );
}
