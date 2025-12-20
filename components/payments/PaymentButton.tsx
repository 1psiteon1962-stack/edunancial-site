"use client";

import { PAYMENT_CONFIG } from "@/lib/payments/payment-config";

interface Props {
  region: keyof typeof PAYMENT_CONFIG;
  label?: string;
}

export default function PaymentButton({
  region,
  label = "Unlock Access",
}: Props) {
  const config = PAYMENT_CONFIG[region];

  return (
    <button
      onClick={() => {
        alert(
          `Payments for ${region} are being activated.\n\nProviders: ${config.providers.join(
            ", "
          )}`
        );
      }}
      style={{
        padding: "12px 20px",
        background: "#0b1f3a",
        color: "#fff",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );
}
