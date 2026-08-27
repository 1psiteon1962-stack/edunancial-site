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

  async function handleClick() {
    if (requireAdultAuthorization && !authorized) {
      setError("Adult purchaser authorization is required before payment.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/square/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, customerEmail, countryCode }),
      });
      const data = (await res.json()) as { success?: boolean; checkoutUrl?: string; error?: string };
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
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
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
