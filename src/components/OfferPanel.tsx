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
          <div key={optimized.id}>
            <h2>{optimized.title}</h2>

            {optimized.description && <p>{optimized.description}</p>}

            <p>Original: ${optimized.price.toFixed(2)}</p>
            <p>Discount: {optimized.discount}%</p>
            <p>Savings: ${optimized.savings.toFixed(2)}</p>

            <p>
              Final Price: ${optimized.finalPrice.toFixed(2)}
              {optimized.discountApplied && " (Discount Applied)"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
