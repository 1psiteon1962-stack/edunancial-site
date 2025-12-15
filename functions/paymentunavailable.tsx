export default function PaymentUnavailable() {
  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "0.75rem",
        background: "#fff7e6",
        border: "1px solid #f0c36d",
        borderRadius: "6px",
        fontSize: "0.9rem"
      }}
    >
      This payment method is not available for this product or region.
    </div>
  );
}
