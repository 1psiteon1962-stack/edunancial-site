"use client";

import { optimizeOffer } from "@/lib/offers";
import { useRegion } from "@/lib/hooks/useRegion";

interface Offer {
  id: string;
  title: string;
  priceUSD: number;
}

interface Props {
  offers: Offer[];
}

export default function OfferPanel({ offers }: Props) {
  const region = useRegion();

  // ✅ FORCE STRING — eliminates undefined
  const safeRegion = region ?? "US";

  return (
    <div>
      {offers.map((offer) => {
        const optimized = optimizeOffer({
          priceUSD: offer.priceUSD,
          region: safeRegion, // ✅ ALWAYS STRING
        });

        return (
          <div
            key={offer.id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "10px",
            }}
          >
            <h3>{offer.title}</h3>
            <p>Price: ${optimized}</p>
          </div>
        );
      })}
    </div>
  );
}
