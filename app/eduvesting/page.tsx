import { LEVEL_META, LiteracyLevel } from "@/lib/levels";

export default function EduVestingPage() {
  const simulatedLevel: LiteracyLevel = 3;

  const level = LEVEL_META[simulatedLevel];

  return (
    <main style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1>EduVesting™</h1>

      <p>
        EduVesting helps you evaluate how you think about investments —
        before you risk capital.
      </p>

      <h2>Your Current Level</h2>
      <p>
        <strong>Level {simulatedLevel}: {level.label}</strong>
      </p>
      <p>{level.description}</p>

      {level.monetizable ? (
        <button disabled>
          Unlock Advanced Capital Scenarios (Payment Disabled)
        </button>
      ) : (
        <p>
          Advance your literacy level to unlock deeper analysis tools.
        </p>
      )}

      <p style={{ marginTop: "2rem", fontSize: "0.85rem" }}>
        EduVesting is not an investment platform and does not provide
        financial advice.
      </p>
    </main>
  );
}
