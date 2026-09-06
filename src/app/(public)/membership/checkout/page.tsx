import { CheckoutPage } from "@/components/payments/CheckoutForm";
import { isSquareVerifiedCheckoutEnabled } from "@/lib/square";

interface Props {
  searchParams: Promise<{ plan?: string; billing?: string }>;
}

export const metadata = {
  title: "Checkout | Edunancial",
  description: "Complete your Edunancial membership checkout.",
};

export default async function MembershipCheckoutPage({ searchParams }: Props) {
  const params = await searchParams;
  const billing = params.billing === "annual" ? "annual" : "monthly";

  return (
    <CheckoutPage
      planId={params.plan}
      billing={billing}
      secureCheckoutEnabled={isSquareVerifiedCheckoutEnabled()}
    />
  );
}
