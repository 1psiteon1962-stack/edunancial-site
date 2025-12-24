import { AFRICA_DISCLAIMER } from "@/lib/disclaimers";

export default function AfricaHome() {
  return (
    <main style={{ padding: "2rem", maxWidth: "900px" }}>
      <h1>Edunancial Africa</h1>

      <p>
        Edunancial Africa exists to help entrepreneurs, builders, and operators
        understand business systems, capital structures, and economic realities
        across rapidly growing African markets.
      </p>

      <p>
        We focus on clarity, structure, and long-term thinking — not speculation,
        hype, or political narratives.
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h2>What We Focus On</h2>
        <ul>
          <li>Business formation & operational thinking</li>
          <li>Capital awareness (not capital solicitation)</li>
          <li>Risk, structure, and scalability</li>
          <li>Cross-border business understanding</li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem", fontSize: "0.85rem" }}>
        <strong>Important Notice</strong>
        <p>{AFRICA_DISCLAIMER}</p>
      </section>
    </main>
  );
}
