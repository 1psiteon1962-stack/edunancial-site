import PaymentButton from "@/components/payments/PaymentButton";
import { resolveRegion } from "@/lib/regions/resolve-region";
import { headers } from "next/headers";

export default function HomePage() {
  const headersList = headers();
  const host = headersList.get("host") || undefined;
  const region = resolveRegion(host);

  return (
    <main style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <h1>Financial Literacy for Builders, Families, and Founders</h1>

      <p>
        Edunancial is a financial literacy platform — not a school, not a
        broker, not a bank.
      </p>

      <p>
        We help people understand money, systems, risk, and opportunity —
        globally.
      </p>

      <PaymentButton region={region} />
    </main>
  );
}
