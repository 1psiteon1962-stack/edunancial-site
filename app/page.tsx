// app/page.tsx
// Edunancial – Primary Global Entry Point
// Financial Literacy (NOT education)
// Netlify + Next.js App Router safe

import { headers } from "next/headers";
import { getPageContent } from "@/lib/content-resolver";

export default function HomePage() {
  const hdrs = headers();
  const host =
    hdrs.get("x-forwarded-host") ||
    hdrs.get("host") ||
    undefined;

  const content = getPageContent(host);

  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "3rem 1.5rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
      }}
    >
      {/* HERO */}
      <section style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.4rem", marginBottom: "1rem" }}>
          {content.heroTitle}
        </h1>

        <p style={{ fontSize: "1.15rem", lineHeight: "1.6" }}>
          {content.heroBody}
        </p>
      </section>

      {/* CORE POSITIONING */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>What Edunancial Actually Does</h2>

        <p>
          Edunancial is a <strong>financial literacy platform</strong>.
          We do not sell motivation. We do not sell hype.
          We provide structured understanding of money, capital,
          risk, ownership, and opportunity — globally.
        </p>
      </section>

      {/* RED / WHITE / BLUE */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>The Red • White • Blue Framework</h2>

        <ul>
          <li>
            <strong>Red:</strong> Foundation — income, expenses,
            cash flow, survival discipline.
          </li>
          <li>
            <strong>White:</strong> Growth — investing, assets,
            valuation, opportunity analysis.
          </li>
          <li>
            <strong>Blue:</strong> Scale — ownership, systems,
            capital access, global positioning.
          </li>
        </ul>
      </section>

      {/* APPS (PLACE-CARDED) */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Edunancial Tools</h2>

        <div style={{ display: "grid", gap: "1rem" }}>
          <div>
            <h3>EduVesting</h3>
            <p>
              Analyze potential investments before risking capital.
              Structured thinking, not financial advice.
            </p>
            <button disabled>Coming Online</button>
          </div>

          <div>
            <h3>EduMath</h3>
            <p>
              Understand the math behind money — interest, leverage,
              compounding, dilution.
            </p>
            <button disabled>Coming Online</button>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP PLACEHOLDERS */}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Membership Access</h2>

        <p>
          Memberships are structured by literacy level and use case
          (individual, family, entrepreneur, founder).
        </p>

        <button disabled>Join (Payments Activating)</button>
      </section>

      {/* FOOTER */}
      <footer style={{ marginTop: "4rem", opacity: 0.7 }}>
        <p>
          © {new Date().getFullYear()} Edunancial.
          Financial literacy — globally structured.
        </p>
      </footer>
    </main>
  );
}
