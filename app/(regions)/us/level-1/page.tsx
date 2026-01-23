import AccessGate from "@/components/AccessGate";

export default function Level1Page() {
  return (
    <AccessGate requiredPlan="starter">
      <div style={{ padding: 24 }}>
        <h1>Level 1 — Starter</h1>
        <p>Welcome to the Starter level tools.</p>
      </div>
    </AccessGate>
  );
}
