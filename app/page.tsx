// app/page.tsx

export default function HomePage() {
  return (
    <main style={{ padding: "3rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1>Edunancial</h1>

      <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
        Education focused on readiness, structure, and long-term business durability.
      </p>

      <p style={{ marginTop: "0.75rem", color: "#555" }}>
        The platform is live. Global rollout is in progress.
      </p>

      <section style={{ marginTop: "3rem" }}>
        <h2>United States</h2>
        <p style={{ marginTop: "0.5rem" }}>
          The U.S. site serves as the primary reference implementation for Edunancial’s
          global architecture, content standards, and deployment model.
        </p>
      </section>
    </main>
  );
}
