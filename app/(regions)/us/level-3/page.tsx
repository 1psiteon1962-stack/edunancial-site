import AccessGate from "@/components/AccessGate";

export default function Level3Page() {
  return (
    <AccessGate requiredPlan="pro">
      <div style={{ padding: 24 }}>
        <h1>Level 3 — Pro</h1>
        <p>Advanced KPI dashboards and investing tools.</p>
      </div>
    </AccessGate>
  );
}
