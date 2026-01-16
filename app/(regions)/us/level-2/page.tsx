import AccessGate from "@/components/AccessGate";

export default function Level2Page() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900 }}>Level 2</h1>

      <AccessGate required="starter">
        <div style={{ border: "1px solid #e5e5e5", padding: 16 }}>
          <strong>Starter Content</strong>
        </div>
      </AccessGate>
    </div>
  );
}
