import { CheckoutPage } from "@/components/payments/CheckoutForm";

interface Props {
  searchParams: Promise<{ plan?: string }>;
}

export const metadata = {
  title: "Checkout | Edunancial",
  description: "Complete your Edunancial membership checkout.",
};

export default async function MembershipCheckoutPage({ searchParams }: Props) {
  const params = await searchParams;
  return <CheckoutPage planId={params.plan} />;
}
