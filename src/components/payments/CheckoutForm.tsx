"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { membershipPlans, type MembershipPlan } from "@/types/membership";

interface CheckoutFormProps {
  plan: MembershipPlan;
}

export default function CheckoutForm({ plan }: CheckoutFormProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"review" | "payment" | "success">("review");
  const [cardForm, setCardForm] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (plan.monthlyPrice === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm text-slate-900">
        <h2 className="text-3xl font-bold">{plan.name} Plan</h2>
        <p className="mt-4 text-slate-600">
          The {plan.name} plan is free. No payment required.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-block w-full rounded-xl bg-blue-700 px-6 py-4 text-center font-bold text-white hover:bg-blue-800"
        >
          Create Free Account
        </Link>
      </div>
    );
  }

  function formatCard(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const digits = cardForm.number.replace(/\s/g, "");
    if (digits.length < 16) { setError("Please enter a valid 16-digit card number."); return; }
    if (!cardForm.expiry.match(/^\d{2}\/\d{2}$/)) { setError("Please enter a valid expiry date (MM/YY)."); return; }
    if (cardForm.cvv.length < 3) { setError("Please enter a valid CVV."); return; }
    if (!cardForm.name) { setError("Please enter the name on the card."); return; }

    setProcessing(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 1500));
    setProcessing(false);
    setStep("success");
  }

  if (step === "success") {
    return (
      <div className="rounded-2xl border border-green-600/40 bg-green-950/20 p-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-800/40 text-3xl">
          ✅
        </div>
        <h2 className="text-3xl font-bold text-green-400">Payment Successful!</h2>
        <p className="mt-4 text-slate-300">
          Welcome to the <strong>{plan.name}</strong> plan. Your membership is now active.
        </p>
        <p className="mt-2 text-slate-400 text-sm">
          A confirmation has been sent to your email address.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="w-full rounded-xl bg-blue-600 py-3 text-center font-bold hover:bg-blue-700"
          >
            Go to My Dashboard
          </Link>
          <Link
            href="/assessment"
            className="w-full rounded-xl border border-slate-600 py-3 text-center font-bold hover:border-white"
          >
            Start Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm text-slate-900">
      {step === "review" && (
        <>
          <h2 className="text-3xl font-bold">{plan.name} Plan</h2>
          <p className="mt-2 text-slate-500">Review your membership before completing payment.</p>

          <div className="mt-8 space-y-3 rounded-xl bg-slate-50 p-6">
            <div className="flex justify-between">
              <span className="text-slate-600">Membership</span>
              <strong>{plan.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Billing Period</span>
              <strong>Monthly</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Monthly Price</span>
              <strong>${plan.monthlyPrice} {plan.currency}</strong>
            </div>
            <hr className="border-slate-200" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Today</span>
              <span>${plan.monthlyPrice} {plan.currency}</span>
            </div>
          </div>

          <div className="mt-6 space-y-2 text-sm text-slate-600">
            <h3 className="font-bold text-slate-800">Plan Includes:</h3>
            <p>{plan.assessmentIncluded ? "✓" : "✗"} Financial Competency Assessment</p>
            <p>{plan.marketplaceIncluded ? "✓" : "✗"} Marketplace Access</p>
            <p>{plan.aiCoachIncluded ? "✓" : "✗"} AI Financial Coach</p>
            <p>{plan.downloadableCourses ? "✓" : "✗"} Downloadable Courses</p>
            <p>{plan.prioritySupport ? "✓" : "✗"} Priority Support</p>
          </div>

          {!user && (
            <div className="mt-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              ⚠ Please{" "}
              <Link href="/login" className="underline font-semibold">sign in</Link>{" "}
              or{" "}
              <Link href="/register" className="underline font-semibold">create an account</Link>{" "}
              before purchasing.
            </div>
          )}

          <button
            onClick={() => setStep("payment")}
            className="mt-8 w-full rounded-xl bg-blue-700 py-4 font-bold text-white hover:bg-blue-800"
          >
            Proceed to Payment →
          </button>

          <p className="mt-4 text-center text-xs text-slate-400">
            Cancel anytime. No lock-in contracts. Secured by SSL.
          </p>
        </>
      )}

      {step === "payment" && (
        <>
          <button
            onClick={() => setStep("review")}
            className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
          >
            ← Back to Review
          </button>

          <h2 className="text-2xl font-bold">Payment Details</h2>
          <p className="mt-1 text-slate-500 text-sm">
            Your payment is processed securely. We do not store card details.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handlePayment} className="mt-6 space-y-5">
            <div>
              <label htmlFor="card-name" className="mb-2 block text-sm font-semibold text-slate-700">
                Name on Card
              </label>
              <input
                id="card-name"
                type="text"
                autoComplete="cc-name"
                value={cardForm.name}
                onChange={(e) => setCardForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
                placeholder="Full name"
                required
              />
            </div>

            <div>
              <label htmlFor="card-number" className="mb-2 block text-sm font-semibold text-slate-700">
                Card Number
              </label>
              <input
                id="card-number"
                type="text"
                autoComplete="cc-number"
                inputMode="numeric"
                value={cardForm.number}
                onChange={(e) => setCardForm((p) => ({ ...p, number: formatCard(e.target.value) }))}
                className="w-full rounded-lg border border-slate-300 p-3 font-mono tracking-widest focus:border-blue-500 focus:outline-none"
                placeholder="0000 0000 0000 0000"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="card-expiry" className="mb-2 block text-sm font-semibold text-slate-700">
                  Expiry Date
                </label>
                <input
                  id="card-expiry"
                  type="text"
                  autoComplete="cc-exp"
                  inputMode="numeric"
                  value={cardForm.expiry}
                  onChange={(e) => setCardForm((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                  className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <label htmlFor="card-cvv" className="mb-2 block text-sm font-semibold text-slate-700">
                  CVV
                </label>
                <input
                  id="card-cvv"
                  type="text"
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  value={cardForm.cvv}
                  onChange={(e) => setCardForm((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                  className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
                  placeholder="•••"
                  required
                />
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <div className="flex justify-between font-bold">
                <span>Total Charge Today</span>
                <span>${plan.monthlyPrice} {plan.currency}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-xl bg-blue-700 py-4 font-bold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {processing ? "Processing payment…" : `Pay $${plan.monthlyPrice} ${plan.currency}`}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span>🔒</span>
            <span>Secured by SSL · Powered by Square</span>
          </div>
        </>
      )}
    </div>
  );
}

export function CheckoutPage({ planId }: { planId?: string }) {
  const selectedPlan = membershipPlans.find((p) => p.id === planId) ?? membershipPlans[1];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-white">
      <nav className="mb-8 flex gap-2 text-sm text-slate-400">
        <Link href="/membership" className="hover:text-white">Membership</Link>
        <span>/</span>
        <span className="text-white">Checkout</span>
      </nav>

      <h1 className="text-4xl font-black">Checkout</h1>
      <p className="mt-2 text-slate-400">
        You selected the{" "}
        <strong className="text-white">{selectedPlan.name}</strong> plan.
      </p>

      <div className="mt-10">
        <CheckoutForm plan={selectedPlan} />
      </div>

      <div className="mt-8 grid gap-4 text-sm text-slate-400 sm:grid-cols-3">
        {[
          { icon: "🔒", text: "256-bit SSL encryption" },
          { icon: "📋", text: "Cancel anytime" },
          { icon: "💳", text: "Visa, Mastercard, Amex" },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2">
            <span>{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
