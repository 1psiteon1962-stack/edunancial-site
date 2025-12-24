import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edunancial",
  description:
    "Edunancial is a global knowledge and infrastructure platform focused on economic systems, analytical frameworks, and region-specific insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          backgroundColor: "#ffffff",
          color: "#111111",
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: "24px 40px",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "28px" }}>Edunancial</h1>
        </header>

        {/* Main Content */}
        <main
          style={{
            padding: "40px",
            maxWidth: "900px",
            lineHeight: 1.6,
          }}
        >
          <p>
            Edunancial operates a global knowledge and infrastructure platform
            designed to help individuals, entrepreneurs, and organizations
            better understand how modern economic systems function in real-world
            environments.
          </p>

          <p>
            The platform provides structured frameworks, analytical tools, and
            region-specific insights that support informed decision-making
            across the United States, Latin America, Africa, and emerging
            markets.
          </p>

          <p>
            Rather than offering generalized instruction or advice, Edunancial
            deploys modular systems and reference models that can be adapted,
            localized, and scaled to reflect local market conditions while
            maintaining a consistent strategic core.
          </p>

          <p>The platform is currently in active development.</p>

          {children}
        </main>

        {/* Footer */}
        <footer
          style={{
            padding: "24px 40px",
            borderTop: "1px solid #e5e5e5",
            fontSize: "13px",
            color: "#555555",
          }}
        >
          <p style={{ margin: 0 }}>
            Edunancial is a platform operated under license from{" "}
            <strong>Caban International Holdings, Inc.</strong>
          </p>
        </footer>
      </body>
    </html>
  );
}
