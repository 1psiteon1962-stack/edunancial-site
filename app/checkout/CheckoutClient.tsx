"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type OfferConfig = {
  code: string;
  price: number;
  label: string;
};

const OFFERS: Record<string, OfferConfig> = {
  basic: { code: "basic", price: 4.99, label: "Basic Access" },
  standard: { code: "standard", price: 9.99, label: "Standard Access" },
  default: { code: "default", price: 9.99, label: "Standard Access" },
};

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const offerParam = searchParams.get("offer") ?? "default";

  const offer = useMemo(() => {
    return OFFERS[offerParam] ?? OFFERS.default;
  }, [offerParam]);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold">{offer.label}</h2>
        <p className="text-gray-600">
          Offer Code: <strong>{offer.code}</strong>
        </p>
        <p className="text-2xl font-bold mt-4">${offer.price}</p>
      </div>

      <button
        className="rounded bg-black px-6 py-3 text-white hover:opacity-90"
        onClick={() => alert("Payment flow goes here")}
      >
        Proceed to Payment
      </button>
    </section>
  );
}
