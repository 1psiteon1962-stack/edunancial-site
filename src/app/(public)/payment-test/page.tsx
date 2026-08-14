import PaymentLinkCheckoutButton from "@/components/payments/PaymentLinkCheckoutButton";

export const metadata = {
  title: "Square Payment Test | Edunancial",
  description: "Temporary $1.00 Square payment test page for Edunancial.",
};

export default function PaymentTestPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-6 py-20 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[#151b2d] p-8 shadow-2xl sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
          Payment Verification
        </p>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl">
          Square Payment Test
        </h1>
        <p className="mt-4 text-3xl font-bold text-green-400">$1.00</p>
        <p className="mt-4 text-lg text-slate-300">
          This page is used to verify Edunancial&apos;s payment system.
        </p>

        <div className="mt-10">
          <PaymentLinkCheckoutButton
            itemId="square-payment-test-001"
            label="Pay $1.00"
          />
        </div>
      </div>
    </main>
  );
}
