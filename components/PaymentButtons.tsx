export default function PaymentButtons() {
  return (
    <div style={{ marginTop: "2rem" }}>
      <button disabled>
        Subscribe (Stripe – US)
      </button>
      <button disabled style={{ marginLeft: "1rem" }}>
        Purchase (Square – US)
      </button>
      <button disabled style={{ marginLeft: "1rem" }}>
        Regional Payments (Coming Soon)
      </button>
    </div>
  );
}
