// components/PaymentSection.tsx
import PaymentButton from "./PaymentButton";
import { PAYMENT_CONFIG } from "@/lib/payments-config";

type Props = {
  region: string;
};

export default function PaymentSection({ region }: Props) {
  const config = PAYMENT_CONFIG[region] || PAYMENT_CONFIG["global"];

  return (
    <section style={{ marginTop: "3rem" }}>
      <h3>Access & Pricing</h3>
      <p>Currency: {config.currency}</p>

      {config.providers.includes("stripe") && (
        <PaymentButton label="Pay with Stripe" provider="stripe" />
      )}

      {config.providers.includes("square") && (
        <PaymentButton label="Pay with Square" provider="square" />
      )}

      {config.providers.includes("crypto") && (
        <PaymentButton label="Pay with Crypto" provider="crypto" />
      )}
    </section>
  );
}
