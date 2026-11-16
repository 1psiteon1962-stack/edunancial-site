"use client";

import { useState } from "react";
import { PAID_PURCHASER_ATTESTATION } from "@/lib/age-consent";

interface PaymentLinkCheckoutButtonProps {
  itemId: string;
  customerEmail?: string;
  countryCode?: string;
  label?: string;
  className?: string;
  requireAdultAuthorization?: boolean;
}

/** Generic checkout button for the hardened country-aware payment-link API. */
export default function PaymentLinkCheckoutButton({
  itemId,
  customerEmail,
  countryCode,
  label = "Pay Now",
  className = "",
  requireAdultAuthorization = false,
}: PaymentLinkCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(!requireAdultAuthorization);
  const [billingPrompt, setBillingPrompt] = useState<{ selected: string; detected: string } | null>(null);

  async function handleClick(billingCountryConfirmed = false) {
    if (requireAdultAuthorization && !authorized) {
      setError("Adult purchaser authorization is required before payment.");
      return;
    }
    setLoading(true);
    setError(null);
    setBillingPrompt(null);

    try {
      const res = await fetch("/api/square/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, customerEmail, countryCode, ...(billingCountryConfirmed ? { billingCountryConfirmed: true } : {}) }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        checkoutUrl?: string;
        error?: string;
        billingCountryConfirmationRequired?: boolean;
        selectedCountry?: string;
        detectedCountry?: string;
      };
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      if (!billingCountryConfirmed && data.billingCountryConfirmationRequired && data.selectedCountry && data.detectedCountry) {
        // A traveling member: ask them to confirm their billing country instead of blocking checkout.
        setBillingPrompt({ selected: data.selectedCountry, detected: data.detectedCountry });
        return;
      }
      throw new Error(data.error ?? "Checkout is unavailable. Please try again.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {requireAdultAuthorization && (
        <label className="flex items-start gap-3 rounded-lg border border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
          <input type="checkbox" checked={authorized} onChange={(event) => setAuthorized(event.target.checked)} className="mt-1 shrink-0" />
          <span>{PAID_PURCHASER_ATTESTATION}</span>
        </label>
      )}
      <button onClick={() => { void handleClick(); }} disabled={loading || (requireAdultAuthorization && !authorized)} className={className}>
        {loading ? "Connecting to Square…" : label}
      </button>
      {billingPrompt && (
        <div role="alertdialog" aria-live="polite" className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-slate-800">
          <p>
            You appear to be connecting from {billingPrompt.detected}, but your selected country is {billingPrompt.selected}.
            If {billingPrompt.selected} is your billing country (for example, you are traveling), confirm to continue.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => { void handleClick(true); }} disabled={loading} className="rounded-md bg-slate-900 px-3 py-2 text-white">
              My billing country is {billingPrompt.selected}
            </button>
            <button type="button" onClick={() => setBillingPrompt(null)} className="rounded-md border border-slate-400 px-3 py-2">
              Change country
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
