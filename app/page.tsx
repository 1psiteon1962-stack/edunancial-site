import LevelsOverview from "@/components/LevelsOverview";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Edunancial</h1>

      <p>
        Financial literacy focused on readiness, structure, discipline,
        and long-term capital durability.
      </p>

      <p>
        The platform is live. Global rollout is in progress.
      </p>

      <div style={{ marginTop: "1.5rem", opacity: 0.8 }}>
        <span style={{ marginRight: "1rem" }}>Site: <strong>us-main</strong></span>
        <span style={{ marginRight: "1rem" }}>Region: <strong>US</strong></span>
        <span style={{ marginRight: "1rem" }}>Language: <strong>EN</strong></span>
        <span>Role: <strong>Primary</strong></span>
      </div>

      {/* BLOCK 9 — LEVEL GOVERNANCE */}
      <LevelsOverview />
    </main>
  );
}
