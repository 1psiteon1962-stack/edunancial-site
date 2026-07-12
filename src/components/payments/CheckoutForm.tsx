"use client";

import Link from "next/link";

import SquareCheckout from "@/components/payments/SquareCheckout";
import { useAuth } from "@/lib/authContext";
import { membershipPlans, type MembershipPlan } from "@/types/membership";

interface CheckoutFormProps {
  plan: MembershipPlan;
  secureCheckoutEnabled: boolean;
}

export default function CheckoutForm({
  plan,
  secureCheckoutEnabled,
}: CheckoutFormProps) {
  const { user } = useAuth();

  if (plan.monthlyPrice === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-slate-900 shadow-sm">
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

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-slate-900 shadow-sm">
      <h2 className="text-3xl font-bold">{plan.name} Plan</h2>
      <p className="mt-2 text-slate-500">
        Review your membership before completing payment.
      </p>

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
          <strong>
            ${plan.monthlyPrice} {plan.currency}
          </strong>
        </div>
        <hr className="border-slate-200" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total Today</span>
          <span>
            ${plan.monthlyPrice} {plan.currency}
          </span>
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
          ⚠ Please <Link href="/login" className="font-semibold underline">sign in</Link> or{" "}
          <Link href="/register" className="font-semibold underline">create an account</Link>{" "}
          before purchasing.
        </div>
      )}

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
        Access is only granted after server-side payment verification. Browser redirects or
        client-side confirmation screens do not activate membership.
      </div>

      {secureCheckoutEnabled && user ? (
        <div className="mt-6">
          <SquareCheckout
            planId={plan.id}
            amount={plan.monthlyPrice}
            currency={plan.currency}
            planName={`${plan.name} Membership`}
          />
        </div>
      ) : !user ? (
        <div className="mt-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-4 text-sm text-yellow-800">
          Sign in before starting checkout so any verified payment can be attached to the
          correct Edunancial account.
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          Verified online membership checkout is currently unavailable. Square remains
          feature-flagged off until webhook verification and membership fulfillment are
          fully implemented.
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/membership"
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-center font-bold text-slate-900 hover:border-slate-400"
        >
          Back to Membership
        </Link>
        <Link
          href="/contact"
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-center font-bold text-white hover:bg-blue-800"
        >
          Contact Support
        </Link>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Cancel anytime. No lock-in contracts. Payments stay gated behind verified
        server-side confirmation.
      </p>
    </div>
  );
}

export function CheckoutPage({
  planId,
  secureCheckoutEnabled,
}: {
  planId?: string;
  secureCheckoutEnabled: boolean;
}) {
  const selectedPlan =
    membershipPlans.find((plan) => plan.id === planId) ?? membershipPlans[1];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-white">
      <nav className="mb-8 flex gap-2 text-sm text-slate-400">
        <Link href="/membership" className="hover:text-white">
          Membership
        </Link>
        <span>/</span>
        <span className="text-white">Checkout</span>
      </nav>

      <h1 className="text-4xl font-black">Checkout</h1>
      <p className="mt-2 text-slate-400">
        You selected the <strong className="text-white">{selectedPlan.name}</strong>{" "}
        plan.
      </p>

      <div className="mt-10">
        <CheckoutForm
          plan={selectedPlan}
          secureCheckoutEnabled={secureCheckoutEnabled}
        />
      </div>

      <div className="mt-8 grid gap-4 text-sm text-slate-400 sm:grid-cols-3">
        {[
          { icon: "🔒", text: "256-bit SSL encryption" },
          { icon: "📋", text: "Cancel anytime" },
          { icon: "✅", text: "Access granted only after verified payment" },
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
