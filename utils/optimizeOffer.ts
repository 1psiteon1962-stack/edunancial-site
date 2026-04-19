// utils/optimizeOffer.ts

import { Offer, OptimizedOffer } from "@/types/offers";

export function optimizeOffer(offer: Offer): OptimizedOffer {
  const discountThreshold = 100;
  const discountRate = 0.1;

  let finalPrice = offer.price;
  let discountApplied = false;

  if (offer.price > discountThreshold) {
    finalPrice = offer.price * (1 - discountRate);
    discountApplied = true;
  }

  return {
    ...offer,
    finalPrice,
    discountApplied,
  };
}
