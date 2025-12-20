// components/PaymentButtons.tsx
// UI-only payment buttons (non-functional by design)

import { Region, getPaymentConfig } from "@/lib/payments-config";

interface Props {
  region: Region;
}

export default function PaymentButtons({ region }: Props) {
  const config = getPaymentConfig(region);

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <p>
        <strong>Available Payment Methods:</strong>
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {config.providers.map((provider) => (
          <button
            key={provider}
            disabled
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "6px",
              border: "1px solid #999",
              background: "#f5f5f5",
              cursor: "not-allowed",
            }}
          >
            {provider} (activating)
          </button>
        ))}
      </div>

      <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", opacity: 0.7 }}>
        Payments will activate once regional processing is enabled.
      </p>
    </div>
  );
}
