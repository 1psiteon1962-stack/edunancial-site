"use client";

import { PaymentRoute } from "@/lib/payments/types";

interface Props {
  options: PaymentRoute[];
}

export default function PaymentButtons({ options }: Props) {
  return (
    <div style={{ marginTop: "2rem" }}>
      {options.map((opt) => (
        <button
          key={opt.provider}
          disabled={!opt.enabled}
          onClick={() => {
            alert(
              opt.enabled
                ? `Payment flow ready for ${opt.provider.toUpperCase()}`
                : "Payment option coming soon"
            );
          }}
          style={{
            display: "block",
            marginBottom: "1rem",
            padding: "0.75rem 1.25rem",
            fontSize: "1rem",
            cursor: opt.enabled ? "pointer" : "not-allowed",
            opacity: opt.enabled ? 1 : 0.5,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
