"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { PAID_PURCHASER_ATTESTATION } from "@/lib/age-consent";
import { formatLocalizedPrice, getLocalizedCatalogPrice } from "@/lib/location/pricing";
import { membershipPlans } from "@/types/membership";

function CheckoutContent() {
  const params = useSearchParams();
  const planId = params.get("plan") ?? "basic";
  const itemId = params.get("item") ?? `membership-${planId}-monthly`;
  const { effectiveLanguage, preferences } = useInternationalPreferences();
  const countryCode = (preferences.country || "us").toUpperCase();

  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);

  const plan = membershipPlans.find((candidate) => candidate.id === planId);
  const displayName = plan?.name ?? "Edunancial Purchase";
  const localizedPrice = plan ? getLocalizedCatalogPrice(plan.id, countryCode) : null;
  const displayPrice = localizedPrice
    ? `${formatLocalizedPrice(localizedPrice, effectiveLanguage)} ${localizedPrice.currency}`
    : plan
      ? `${plan.currency} ${plan.monthlyPrice.toFixed(2)}`
      : "Final price shown at secure checkout";

  async function handleCheckout() {
    if (!authorized) {
      setError("Adult purchaser authorization is required before payment.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/square/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          discountCode: discountCode.trim() || undefined,
          countryCode,
        }),
      });
      const data = (await res.json()) as { success?: boolean; checkoutUrl?: string; error?: string };
      if (!res.ok || !data.success || !data.checkoutUrl) {
        throw new Error(data.error ?? "Checkout is unavailable. Please try again.");
      }
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0f1e] px-4 py-16 text-white">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#151b2d] p-8 sm:p-10">
        <h1 className="mb-2 text-4xl font-black">Checkout</h1>
        <p className="mb-6 text-sm text-slate-400">Complete your purchase through Edunancial&apos;s verified payment flow.</p>

        <div className="mb-6 space-y-3 rounded-xl border border-white/10 bg-slate-900/60 p-5 text-sm">
          <div className="flex justify-between"><span className="text-slate-400">Item</span><strong>{displayName}</strong></div>
          {plan && <div className="flex justify-between"><span className="text-slate-400">Billing</span><strong>{plan.billingLabel}</strong></div>}
          <div className="flex justify-between border-t border-white/10 pt-3 text-base font-bold"><span>Total Today</span><span>{displayPrice}</span></div>
          {localizedPrice?.currency !== "USD" && localizedPrice && (
            <p className="text-xs text-slate-500">Localized price for {countryCode}. Taxes, where applicable, are calculated at checkout. Payment remains unavailable until an approved {localizedPrice.currency} settlement route is configured.</p>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-slate-400">Discount Code (optional)</label>
          <input type="text" value={discountCode} onChange={(event) => setDiscountCode(event.target.value)} placeholder="Enter code" className="w-full rounded-lg border border-white/10 bg-[#0a0f1e] px-4 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none" />
        </div>

        <label className="mb-4 flex items-start gap-3 rounded-lg border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">
          <input type="checkbox" checked={authorized} onChange={(event) => setAuthorized(event.target.checked)} className="mt-1 shrink-0" />
          <span>{PAID_PURCHASER_ATTESTATION}</span>
        </label>

        {error && <div className="mb-4 rounded-lg border border-red-700 bg-red-900/30 px-4 py-3 text-sm text-red-300">{error}</div>}

        <button onClick={() => { void handleCheckout(); }} disabled={loading || !authorized} className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Connecting to Square…" : "Continue to Secure Checkout"}
        </button>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-slate-500"><div>🔒 Secure</div><div>📋 Cancel anytime</div><div>✅ Verified payment</div></div>
        <div className="mt-6 flex gap-3 text-sm">
          <Link href="/membership" className="flex-1 rounded-xl border border-white/20 px-4 py-3 text-center hover:border-white/40">← Back to Plans</Link>
          <Link href="/contact" className="flex-1 rounded-xl border border-white/20 px-4 py-3 text-center hover:border-white/40">Need Help?</Link>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">Access is granted only after server-side payment verification.</p>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-[#0a0f1e] text-white"><p className="text-xl">Loading checkout…</p></main>}>
      <CheckoutContent />
    </Suspense>
  );
}
