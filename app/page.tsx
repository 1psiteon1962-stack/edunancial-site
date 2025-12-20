// app/page.tsx
// Edunancial Primary Entry Page
// Netlify + Next.js safe
// Financial literacy focused (not formal education)

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
      }}
    >
      {/* HERO */}
      <section style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          Edunancial
        </h1>

        <p style={{ fontSize: "1.25rem", lineHeight: "1.6" }}>
          A financial literacy platform designed to help individuals,
          families, founders, and future entrepreneurs understand money,
          capital, risk, and opportunity — across every stage of life.
        </p>

        <p style={{ marginTop: "1rem", color: "#555" }}>
          This is not formal education. This is practical financial
          literacy for the real world.
        </p>
      </section>

      {/* CORE PILLARS */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Our Focus</h2>
        <ul style={{ lineHeight: "1.8" }}>
          <li>Founders & Entrepreneurs</li>
          <li>Families & Intergenerational Wealth</li>
          <li>Youth & Early Financial Literacy</li>
          <li>Global Capital Awareness (U.S. & International)</li>
        </ul>
      </section>

      {/* PLATFORM TOOLS */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Platform Tools</h2>

        <p>
          Edunancial is building proprietary tools to help users evaluate
          opportunities, understand risk, and make informed decisions.
        </p>

        <ul style={{ lineHeight: "1.8", marginTop: "1rem" }}>
          <li>
            <strong>EduVesting™</strong> — investment thinking frameworks
            and decision support tools
          </li>
          <li>
            <strong>EduMath™</strong> — applied math for money, pricing,
            growth, and risk
          </li>
          <li>
            <strong>Levels Framework™</strong> — understand where you are
            and how to progress
          </li>
        </ul>
      </section>

      {/* GLOBAL STRUCTURE */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Global by Design</h2>

        <p>
          The U.S. site serves as the primary platform. Regional mirror
          sites provide localized access, language, and payment options
          while reporting into a unified system.
        </p>

        <p style={{ marginTop: "0.75rem", color: "#555" }}>
          Initial regions include the United States, Africa, and
          English-speaking Asia, with expansion continuing in phases.
        </p>
      </section>

      {/* CTA PLACEHOLDERS */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Get Started</h2>

        <p>
          Access to tools and content will vary based on engagement level.
          Some features are free, others require registration or paid
          access.
        </p>

        <div style={{ marginTop: "1.5rem" }}>
          <button
            style={{
              padding: "0.75rem 1.5rem",
              marginRight: "1rem",
              cursor: "pointer",
            }}
          >
            Explore Platform
          </button>

          <button
            style={{
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
            }}
          >
            Create Account
          </button>
        </div>
      </section>

      {/* LEGAL / POSITIONING */}
      <section
        style={{
          borderTop: "1px solid #ddd",
          paddingTop: "1.5rem",
          fontSize: "0.85rem",
          color: "#555",
        }}
      >
        <p>
          © {new Date().getFullYear()} Edunancial, Inc. All rights reserved.
        </p>

        <p>
          Edunancial is not a licensed investment advisor, broker-dealer,
          or financial institution. Tools and content are provided for
          informational and analytical purposes only.
        </p>
      </section>
    </main>
  );
}
