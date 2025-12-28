export default function HomePage() {
  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem" }}>
      <h1>Edunancial</h1>

      <p>
        Edunancial operates a global knowledge and infrastructure platform
        designed to help individuals, entrepreneurs, and organizations better
        understand how modern economic systems function in real-world
        environments.
      </p>

      <p>
        The platform provides structured frameworks, analytical tools, and
        region-specific insights that support informed decision-making across
        the United States, Latin America, Africa, and emerging markets.
      </p>

      <p>
        Rather than offering generalized instruction or advice, Edunancial
        deploys modular systems and reference models that can be adapted,
        localized, and scaled to reflect local market conditions while
        maintaining a consistent strategic core.
      </p>

      <p>The platform is currently in active development.</p>

      {/* =========================
          START HERE SECTION
         ========================= */}

      <section
        style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid #e5e5e5",
        }}
      >
        <h2>Start With Capital Discipline</h2>

        <p>
          Every economy — developed or emerging — is built on the same three
          capital paths. These paths are not trends, shortcuts, or guarantees.
          They are the structural ways wealth is created, preserved, and scaled
          over time.
        </p>

        <p>
          Edunancial organizes its thinking around these three paths so users can
          understand where they are, where they want to go, and what systems are
          required to move between them.
        </p>

        <div style={{ marginTop: "2rem" }}>
          <h3>🔴 Red — Real Assets</h3>
          <p>
            Land, housing, infrastructure, and physical collateral.  
            Capital that exists independently of market sentiment and financial
            cycles.
          </p>

          <h3>⚪ White — Financial & Paper Systems</h3>
          <p>
            Credit, markets, equities, instruments, and regulated financial
            structures.  
            Capital that grows through rules, leverage, and compounding systems.
          </p>

          <h3>🔵 Blue — Businesses & Operating Systems</h3>
          <p>
            Companies, cash flow, execution, management, and scale.  
            Capital built through disciplined operations and decision-making.
          </p>
        </div>

        <p style={{ marginTop: "1.5rem" }}>
          These paths are not mutually exclusive. Many individuals and
          organizations pursue more than one — often sequentially, sometimes
          simultaneously.
        </p>

        <p style={{ fontStyle: "italic" }}>
          Most people struggle not because they choose the wrong path, but
          because they never understand how the paths interact.
        </p>
      </section>
    </main>
  );
}
