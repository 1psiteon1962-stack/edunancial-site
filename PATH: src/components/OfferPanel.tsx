"use client";

import { optimizeOffer } from "@/lib/offers";
import { useRegion } from "@/lib/hooks/useRegion";

interface Offer {
  id: string;
  name: string;
  priceUSD: number;
}

interface Props {
  offers: Offer[];
}

export default function OfferPanel({ offers }: Props) {
  const region = useRegion(); // now ALWAYS string

  return (
    <div>
      {offers.map((offer) => {
        const optimized = optimizeOffer({
          priceUSD: offer.priceUSD,
          region, // ✅ guaranteed string
        });

        return (
          <div key={offer.id}>
            <h3>{offer.name}</h3>
            <p>{optimized.displayPrice}</p>
          </div>
        );
      })}
    </div>
  );
}
