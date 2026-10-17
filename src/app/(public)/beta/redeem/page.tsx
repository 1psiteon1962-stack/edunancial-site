import BetaRedeemForm from "@/components/beta/BetaRedeemForm";

export const metadata = {
  title: "Redeem Alpha/Beta Access Code | Edunancial",
  description: "Activate 90 days of full Edunancial access with your tester code. No credit card required.",
  robots: { index: false, follow: false },
};

export default function BetaRedeemPage() {
  return <BetaRedeemForm />;
}