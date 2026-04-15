"use client";

import { Offer, OptimizedOffer } from "@/types/offers";
import { optimizeOffer } from "@/utils/optimizeOffer";

interface Props {
  offers: Offer[];
}

export default function OfferPanel({ offers }: Props) {
  return (
    <div>
      {offers.map((offer) => {
        const optimized: OptimizedOffer = optimizeOffer(offer);

        return (
          <div key={offer.id} style={{ marginBottom: "20px" }}>
            <h3>{optimized.title}</h3>

            <p>Original Price: ${optimized.price}</p>

            <p>Discount: {offer.discount ?? 0}%</p>

            <p>Savings: ${optimized.savings.toFixed(2)}</p>

            <p>
              <strong>
                Final Price: ${optimized.finalPrice.toFixed(2)}
              </strong>
            </p>
          </div>
        );
      })}
    </div>
  );
}
