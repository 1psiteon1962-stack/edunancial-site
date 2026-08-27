"use client";

import { useState } from "react";

interface PaymentLinkCheckoutButtonProps {
  itemId: string;
  customerEmail?: string;
  countryCode?: string;
  label?: string;
  className?: string;
}

/**
 * Generic checkout button that posts to /api/square/payment-link and
 * redirects the browser to the returned Square checkout URL.
 */
export default function PaymentLinkCheckoutButton({
  itemId,
  customerEmail,
  countryCode,
  label = "Pay Now",
  className = "",
}: PaymentLinkCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/square/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, customerEmail, countryCode }),
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
    <div>
      <button
        onClick={() => { void handleClick(); }}
        disabled={loading}
        className={className}
      >
        {loading ? "Connecting to Square…" : label}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
