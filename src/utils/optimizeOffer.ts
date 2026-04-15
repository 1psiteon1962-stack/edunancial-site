import { Offer, OptimizedOffer } from "@/types/offers";

export function optimizeOffer(offer: Offer): OptimizedOffer {
  const discount = offer.discount ?? 0;

  const savings = (offer.price * discount) / 100;
  const finalPrice = offer.price - savings;

  return {
    ...offer,
    savings,
    finalPrice,
  };
}
