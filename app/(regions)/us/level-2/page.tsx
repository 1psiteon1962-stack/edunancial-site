import AccessGate from "@/components/AccessGate";

export default function Level2Page() {
  return (
    <AccessGate requiredPlan="growth">
      <div style={{ padding: 24 }}>
        <h1>Level 2 — Growth</h1>
        <p>Intermediate scaling and wealth-building content.</p>
      </div>
    </AccessGate>
  );
}
