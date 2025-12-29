// app/africa/page.tsx

export const metadata = {
  title: "Edunancial — Africa",
  description:
    "Capital formation, entrepreneurship, and lawful wealth systems across African markets.",
};

export default function AfricaPage() {
  return (
    <main style={{ maxWidth: "820px", margin: "0 auto", padding: "2.5rem 1.25rem" }}>
      {/* Language Selector */}
      <div style={{ marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        <a href="/africa?lang=en">EN</a> |{" "}
        <a href="/africa?lang=fr">FR</a>
      </div>

      <h1 style={{ fontSize: "2.2rem", marginBottom: "0.75rem" }}>
        Edunancial — Africa
      </h1>

      <p style={{ fontSize: "1.1rem", color: "#444", marginBottom: "2rem" }}>
        Capital formation, entrepreneurship, and long-term economic durability.
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <p>
          Edunancial focuses on lawful business formation, real assets, and capital
          discipline across emerging and developing African markets.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
          Red / White / Blue Framework
        </h2>

        <ul style={{ paddingLeft: "1.25rem", lineHeight: "1.7" }}>
          <li>
            <strong>Red</strong> — Land, housing, agriculture, and infrastructure
          </li>
          <li>
            <strong>White</strong> — Financial participation and structured capital
          </li>
          <li>
            <strong>Blue</strong> — Businesses, services, and trade enterprises
          </li>
        </ul>
      </section>

      <section style={{ borderTop: "1px solid #ddd", paddingTop: "1.75rem" }}>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          Educational material only. Users must comply with local laws and
          regulatory frameworks in their jurisdiction.
        </p>
      </section>
    </main>
  );
}
