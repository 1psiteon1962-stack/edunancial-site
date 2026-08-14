"use client";

import { useState } from "react";

interface PaymentLinkCheckoutButtonProps {
  itemId: string;
  label: string;
  customerEmail?: string;
  className?: string;
}

export default function PaymentLinkCheckoutButton({
  itemId,
  label,
  customerEmail,
  className,
}: PaymentLinkCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/square/payment-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          customerEmail,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; checkoutUrl?: string; error?: string }
        | null;

      if (!response.ok || !data?.success || !data.checkoutUrl) {
        throw new Error(
          data?.error ?? "Secure checkout is unavailable right now."
        );
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Checkout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => {
          void handleCheckout();
        }}
        disabled={loading}
        className={
          className ??
          "inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-6 py-4 text-lg font-bold text-white transition hover:bg-blue-800 disabled:opacity-60"
        }
      >
        {loading ? "Connecting to Square…" : label}
      </button>
      {error ? (
        <p className="text-center text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
