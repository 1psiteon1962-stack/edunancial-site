// components/PaymentButton.tsx
// Visual purchase button ONLY — no processing

type Props = {
  label: string;
  provider: "stripe" | "square" | "crypto";
};

export default function PaymentButton({ label, provider }: Props) {
  return (
    <button
      style={{
        padding: "12px 20px",
        margin: "10px 10px 0 0",
        borderRadius: "6px",
        border: "1px solid #000",
        cursor: "pointer",
        background: "#f5f5f5",
        fontWeight: 600
      }}
      onClick={() => {
        alert(
          `${provider.toUpperCase()} checkout will activate once merchant services are connected.`
        );
      }}
    >
      {label}
    </button>
  );
}
