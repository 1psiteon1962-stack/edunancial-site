import React from "react";

type PaymentButtonsProps = {
  availableProviders: string[];
};

const LABELS: Record<string, string> = {
  paypal: "Pay with PayPal",
  square: "Pay with Card",
  bank: "Bank Transfer",
  crypto: "Crypto Payment"
};

export default function PaymentButtons({ availableProviders }: PaymentButtonsProps) {
  if (!availableProviders || availableProviders.length === 0) {
    return (
      <div style={{ color: "#777", marginTop: "1rem" }}>
        No payment methods available for this product.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {availableProviders.map((provider) => (
        <button
          key={provider}
          disabled
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: "#f5f5f5",
            cursor: "not-allowed"
          }}
        >
          {LABELS[provider] || provider}
        </button>
      ))}
    </div>
  );
}
