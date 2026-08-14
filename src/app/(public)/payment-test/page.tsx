// TEMPORARY TEST ITEM — Square payment verification only, remove before next production content push
import PaymentLinkCheckoutButton from "@/components/payments/PaymentLinkCheckoutButton";

export const metadata = {
  title: "Square Payment Test | Edunancial",
  description: "Temporary $1.00 Square payment verification page.",
  robots: { index: false, follow: false },
};

export default function PaymentTestPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-6 py-20 text-white">
      <div className="mx-auto max-w-lg rounded-2xl border border-yellow-500/40 bg-yellow-900/10 p-8">
        <p className="mb-2 text-xs font-black uppercase tracking-widest text-yellow-400">
          ⚠ Temporary — Dev / QA Only
        </p>
        <h1 className="text-4xl font-black">Square Payment Test</h1>
        <p className="mt-4 text-slate-300">
          This page runs a real <strong>$1.00 USD</strong> charge through the
          Square production checkout and webhook pipeline to verify end-to-end
          payment processing.
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Item ID: <code className="text-yellow-300">square-payment-test-001</code>
        </p>

        <div className="mt-8">
          <PaymentLinkCheckoutButton
            itemId="square-payment-test-001"
            label="Run $1.00 Square Test"
            className="w-full rounded-xl bg-yellow-500 px-6 py-4 text-lg font-bold text-slate-950 hover:bg-yellow-400 disabled:opacity-60 transition"
          />
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Remove this page and the catalog entry before the next production
          content push.
        </p>
      </div>
    </main>
  );
}
