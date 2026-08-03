"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { startSquareCheckout } from "@/lib/squareCheckout";
import { membershipPlans } from "@/types/membership";

function CheckoutContent() {
  const params = useSearchParams();
  const planId = params.get("plan") ?? "basic";
  const itemId = params.get("item") ?? `membership-${planId}-monthly`;

  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Resolve plan display for memberships.
  const plan = membershipPlans.find((p) => p.id === planId);
  const displayName = plan?.name ?? "Membership";
  const displayPrice = plan ? `$${plan.monthlyPrice.toFixed(2)} ${plan.currency}` : "";

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      // Try the unified payment-link API first.
      const res = await fetch("/api/square/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          discountCode: discountCode.trim() || undefined,
          customerEmail: undefined,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        checkoutUrl?: string;
        error?: string;
      };

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      // Fall back to legacy membership checkout for backwards compatibility.
      if (plan) {
        await startSquareCheckout({
          id: planId,
          name: displayName,
          price: plan.monthlyPrice,
          currency: plan.currency,
        });
        return;
      }

      throw new Error(data.error ?? "Checkout is unavailable. Please try again.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Checkout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl bg-[#151b2d] border border-white/10 p-8 sm:p-10">
        <h1 className="text-4xl font-black mb-2">Checkout</h1>
        <p className="text-slate-400 text-sm mb-6">
          Complete your purchase securely through Square.
        </p>

        {plan && (
          <div className="rounded-xl bg-slate-900/60 border border-white/10 p-5 mb-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Item</span>
              <strong>{displayName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Billing</span>
              <strong>{plan.billingLabel}</strong>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-3 text-base font-bold">
              <span>Total Today</span>
              <span>{displayPrice}</span>
            </div>
          </div>
        )}

        {/* Discount code input */}
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-1">
            Discount Code (optional)
          </label>
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Enter code"
            className="w-full rounded-lg bg-[#0a0f1e] border border-white/10 px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-700 bg-red-900/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          onClick={() => { void handleCheckout(); }}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white hover:bg-blue-500 disabled:opacity-60 transition"
        >
          {loading ? "Connecting to Square…" : "Continue to Secure Checkout"}
        </button>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-slate-500">
          <div>🔒 256-bit SSL</div>
          <div>📋 Cancel anytime</div>
          <div>✅ Verified payment</div>
        </div>

        <div className="mt-6 flex gap-3 text-sm">
          <Link
            href="/membership"
            className="flex-1 rounded-xl border border-white/20 px-4 py-3 text-center hover:border-white/40"
          >
            ← Back to Plans
          </Link>
          <Link
            href="/contact"
            className="flex-1 rounded-xl border border-white/20 px-4 py-3 text-center hover:border-white/40"
          >
            Need Help?
          </Link>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Access is granted only after server-side payment verification.
        </p>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center text-white">
          <p className="text-xl">Loading checkout…</p>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
