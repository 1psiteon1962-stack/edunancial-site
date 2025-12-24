import "../../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edunancial Africa",
  description:
    "Regional market frameworks and capital awareness adapted for African economies.",
};

export default function AfricaLanguageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            padding: "16px",
            borderBottom: "1px solid #e5e7eb",
            fontWeight: 600,
          }}
        >
          Edunancial · Africa
        </header>

        <main style={{ padding: "24px", minHeight: "80vh" }}>
          {children}
        </main>

        <footer
          style={{
            padding: "16px",
            borderTop: "1px solid #e5e7eb",
            fontSize: "0.85rem",
            color: "#555",
          }}
        >
          Operated under license from Caban International Holdings, Inc.
          <br />
          Informational frameworks only. No professional, financial, or legal
          advice provided.
        </footer>
      </body>
    </html>
  );
}
