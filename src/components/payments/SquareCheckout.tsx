"use client";

import { useState } from "react";
import { startSquareCheckout } from "@/lib/squareCheckout";

interface SquareCheckoutProps {
  planId: string;
  amount: number;
  currency: string;
  planName?: string;
}

export default function SquareCheckout({
  planId,
  amount,
  currency,
  planName,
}: SquareCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    try {
      setLoading(true);
      setError(null);
      await startSquareCheckout({
        id: planId,
        name: planName ?? `Plan ${planId}`,
        price: amount,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Checkout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="flex w-full items-center justify-center rounded-xl bg-blue-700 px-6 py-4 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
      >
        {loading ? "Connecting…" : `Pay ${currency} ${amount}`}
      </button>
      {error && (
        <p className="text-center text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
