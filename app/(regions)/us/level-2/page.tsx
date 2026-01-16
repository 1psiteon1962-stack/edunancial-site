import AccessGate from "@/app/(regions)/us/components/AccessGate";

export default function Level2Page() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Level 2</h1>

      <p style={{ marginTop: 0, opacity: 0.7 }}>
        Advanced tools and workflows
      </p>

      {/* Level 2 requires PRO access — NOT starter */}
      <AccessGate required="pro">
        <div
          style={{
            border: "1px solid #e5e5e5",
            padding: "1.5rem",
            marginTop: "1.5rem",
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: "0.5rem" }}>
            Level 2 Features
          </div>

          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            <li>Expanded analytics</li>
            <li>Workflow automation</li>
            <li>Advanced reporting</li>
          </ul>
        </div>
      </AccessGate>
    </div>
  );
}
