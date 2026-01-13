import { PLAN_LABELS, type PlanTier } from "../../../types/plan";

const providerCard: React.CSSProperties = {
  border: "1px solid #e5e5e5",
  borderRadius: 14,
  padding: 14,
};

function PlanRow({ tier, price }: { tier: PlanTier; price: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid #eee" }}>
      <div style={{ fontWeight: 800 }}>{PLAN_LABELS[tier]}</div>
      <div style={{ fontWeight: 800 }}>{price}</div>
    </div>
  );
}

export default function USPayPage() {
  return (
    <main>
      <h1 style={{ fontSize: 30, marginBottom: 6 }}>Pay</h1>
      <p style={{ marginTop: 0, opacity: 0.85 }}>
        Payments are structured to support multiple merchant services (Stripe, PayPal, Square, future providers, and crypto later).
        Buttons will be connected once merchant accounts are ready.
      </p>

      <div style={{ border: "1px solid #e5e5e5", borderRadius: 14, padding: 14, marginTop: 16 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Plans (US)</div>
        <PlanRow tier="free" price="$0" />
        <PlanRow tier="starter" price="$4.99 / mo" />
        <PlanRow tier="pro" price="$9.99 / mo" />
        <PlanRow tier="elite" price="Custom / Invite" />
        <div style={{ opacity: 0.8, marginTop: 10 }}>
          Note: pricing is editable later. This page is the payment hub.
        </div>
      </div>

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <div style={providerCard}>
          <div style={{ fontWeight: 800 }}>Stripe</div>
          <div style={{ opacity: 0.85, marginTop: 6 }}>
            Placeholder button (wire later).
          </div>
          <button style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, border: "1px solid #111", fontWeight: 800 }}>
            Pay
          </button>
        </div>

        <div style={providerCard}>
          <div style={{ fontWeight: 800 }}>PayPal</div>
          <div style={{ opacity: 0.85, marginTop: 6 }}>
            Placeholder button (wire later).
          </div>
          <button style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, border: "1px solid #111", fontWeight: 800 }}>
            Pay
          </button>
        </div>

        <div style={providerCard}>
          <div style={{ fontWeight: 800 }}>Square</div>
          <div style={{ opacity: 0.85, marginTop: 6 }}>
            Placeholder button (wire later).
          </div>
          <button style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, border: "1px solid #111", fontWeight: 800 }}>
            Pay
          </button>
        </div>

        <div style={providerCard}>
          <div style={{ fontWeight: 800 }}>Future Providers</div>
          <div style={{ opacity: 0.85, marginTop: 6 }}>
            Add FormEx, bank transfer, and optional crypto later without redesigning the site.
          </div>
          <button style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, border: "1px solid #111", fontWeight: 800 }}>
            Pay
          </button>
        </div>
      </div>
    </main>
  );
}
