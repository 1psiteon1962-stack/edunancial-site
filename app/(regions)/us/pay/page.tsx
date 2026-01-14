import Link from "next/link";
import { PLANS, PlanCode } from "../../../types/plan";

const wrap: React.CSSProperties = { maxWidth: 900, margin: "0 auto", padding: "28px 18px" };
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 };
const card: React.CSSProperties = { border: "1px solid #ddd", borderRadius: 14, padding: 16, background: "white" };

function PayButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      style={{
        width: "100%",
        marginTop: 10,
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid #111",
        background: "#111",
        color: "white",
        fontWeight: 700,
        cursor: "pointer",
      }}
      onClick={() => alert("Payment wiring comes next: Stripe / PayPal / Square")}
    >
      Pay
    </button>
  );
}

export default function USPayPage() {
  const order: PlanCode[] = ["starter", "pro", "elite"];

  return (
    <main style={wrap}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Upgrade</h1>
      <p style={{ opacity: 0.85, marginTop: 0 }}>
        Choose a plan. Payment methods (Stripe / PayPal / Square) will appear on this page next.
      </p>

      <div style={{ margin: "14px 0 22px" }}>
        <Link href="/us" style={{ textDecoration: "underline" }}>
          ← Back to US
        </Link>
      </div>

      <div style={grid}>
        {order.map((code) => {
          const p = PLANS[code];
          return (
            <div key={p.code} style={card}>
              <div style={{ fontWeight: 900, fontSize: 18 }}>{p.label}</div>
              <div style={{ opacity: 0.85, marginTop: 6 }}>{p.description}</div>

              <div style={{ marginTop: 10, fontWeight: 800 }}>${p.price}/mo</div>

              <ul style={{ marginTop: 10, paddingLeft: 18 }}>
                {p.features.map((f) => (
                  <li key={f} style={{ marginBottom: 6 }}>
                    {f}
                  </li>
                ))}
              </ul>

              <PayButton label={p.label} />
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, opacity: 0.8, fontSize: 13 }}>
        Security note: we’ll wire payments using provider-hosted checkout or tokenization so card data never touches your server.
      </div>
    </main>
  );
}
