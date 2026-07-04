"use client";

import { useState } from "react";

interface SquareCheckoutProps {

  planId: string;

  amount: number;

  currency: string;

}

export default function SquareCheckout({

  planId,

  amount,

  currency,

}: SquareCheckoutProps) {

  const [loading, setLoading] = useState(false);

  async function handleCheckout() {

    try {

      setLoading(true);

      // TODO:
      // Create Checkout Session
      // POST /api/payments/square/create-checkout

      console.log("Checkout");

      console.log(planId);

      console.log(amount);

      console.log(currency);

      // Future:
      // Redirect to Square Hosted Checkout

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  return (

    <button

      onClick={handleCheckout}

      disabled={loading}

      className="flex w-full items-center justify-center rounded-xl bg-blue-700 px-6 py-4 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"

    >

      {loading
        ? "Connecting..."
        : `Pay ${currency} ${amount}`}

    </button>

  );

}
