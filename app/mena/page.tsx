export default function MENAPage() {
  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem" }}>
      
      {/* Language Selector */}
      <div style={{ marginBottom: "1.5rem" }}>
        <a href="/mena?lang=ar">AR</a>{" | "}
        <a href="/mena?lang=en">EN</a>{" | "}
        <a href="/mena?lang=fr">FR</a>
      </div>

      <h1>Edunancial — MENA</h1>

      <h2 style={{ marginTop: "1rem" }}>
        Financial structure, discipline, and long-term continuity.
      </h2>

      <p style={{ marginTop: "1.5rem" }}>
        We focus on capital systems, governance, and durable financial strategies
        across the Middle East and North Africa.
      </p>

      <p>
        The MENA region spans sovereign capital, family offices, state-led
        development, and emerging private enterprise. Edunancial approaches this
        landscape with respect for institutional frameworks and regional nuance.
      </p>

      <p>
        Our work emphasizes clarity of structure, disciplined deployment of
        capital, and continuity across generations — rather than short-term
        speculation.
      </p>

    </main>
  );
}
