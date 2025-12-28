"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { OFFERS } from "./offers";

export default function CheckoutClient() {
  const searchParams = useSearchParams();

  const offerParam = searchParams?.get("offer") ?? "default";

  const offer = useMemo(() => {
    return OFFERS[offerParam] ?? OFFERS.default;
  }, [offerParam]);

  return (
    <section style={{ maxWidth: "640px", margin: "0 auto" }}>
      <h1>{offer.title}</h1>
      <p>{offer.description}</p>

      {offer.price === 0 ? (
        <p><strong>Free access</strong></p>
      ) : (
        <p><strong>Price:</strong> ${offer.price}</p>
      )}
    </section>
  );
}
