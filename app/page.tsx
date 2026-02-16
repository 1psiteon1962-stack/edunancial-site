export const metadata = {
  title: "Edunancial",
  description: "Edunancial — Education, Structure, and Financial Readiness",
};

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        Edunancial
      </h1>

      <p style={{ maxWidth: "600px", fontSize: "1.1rem", lineHeight: "1.6" }}>
        Education-first infrastructure for financial literacy, readiness,
        and structured growth — built for long-term thinking.
      </p>

      <p style={{ marginTop: "2rem", opacity: 0.7 }}>
        If you can see this page, routing is working correctly.
      </p>
    </main>
  );
}
