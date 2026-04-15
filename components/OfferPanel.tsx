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
        /**
         * ✅ NOW THIS IS VALID — NO TYPE ERROR
         */
        const optimized: OptimizedOffer = optimizeOffer(offer);

        return (
          <div key={offer.id}>
            <h3>{optimized.title}</h3>

            <p>Original: ${optimized.price}</p>
            <p>Discount: {optimized.discount ?? 0}%</p>

            <p>Savings: ${optimized.savings.toFixed(2)}</p>

            <p>
              <strong>
                Final: ${optimized.finalPrice.toFixed(2)}
              </strong>
            </p>
          </div>
        );
      })}
    </div>
  );
}
