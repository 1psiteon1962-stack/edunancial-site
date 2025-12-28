"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { OFFERS } from "./offers"; // adjust path if needed

export default function CheckoutClient() {
  const searchParams = useSearchParams();

  const offerParam = searchParams?.get("offer") ?? "default";

  const offer = useMemo(() => {
    return OFFERS[offerParam] ?? OFFERS.default;
  }, [offerParam]);

  if (!offer) {
    return (
      <div>
        <h2>Invalid offer</h2>
        <p>Please check your link or contact support.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{offer.title}</h1>
      <p>{offer.description}</p>
      {/* rest of checkout UI */}
    </div>
  );
}
