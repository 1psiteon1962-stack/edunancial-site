import { LEVEL_META, LiteracyLevel } from "@/lib/levels";

export default function EduMathPage() {
  const simulatedLevel: LiteracyLevel = 2;
  const level = LEVEL_META[simulatedLevel];

  return (
    <main style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1>EduMath™</h1>

      <p>
        EduMath measures how well you understand the math behind money —
        cashflow, leverage, and risk.
      </p>

      <h2>Your Diagnostic Result</h2>
      <p>
        <strong>Level {simulatedLevel}: {level.label}</strong>
      </p>
      <p>{level.description}</p>

      {level.monetizable ? (
        <button disabled>
          Access Advanced Financial Models (Payment Disabled)
        </button>
      ) : (
        <p>
          Continue building your financial foundations to unlock advanced tools.
        </p>
      )}

      <p style={{ marginTop: "2rem", fontSize: "0.85rem" }}>
        EduMath evaluates financial reasoning — not academic math.
      </p>
    </main>
  );
}
