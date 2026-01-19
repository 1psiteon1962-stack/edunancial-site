import AccessGate from "@/components/AccessGate";

const card: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: 16,
  marginBottom: 16,
};

export default function AppsPage() {
  return (
    <div>
      <h1>Applications</h1>

      {/* FIX: PlanCode values are LOWERCASE */}
      <AccessGate required="starter">
        <div style={card}>
          <h2>Starter Tools</h2>
          <p>Entry-level financial and planning tools</p>
        </div>
      </AccessGate>
    </div>
  );
}
