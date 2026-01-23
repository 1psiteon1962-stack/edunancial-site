import AccessGate from "@/components/AccessGate";

export default function AppsPage() {
  return (
    <AccessGate requiredPlan="starter">
      <div style={{ padding: 24 }}>
        <h1>Starter Tools</h1>
        <p>Entry-level financial and planning tools.</p>
      </div>
    </AccessGate>
  );
}
