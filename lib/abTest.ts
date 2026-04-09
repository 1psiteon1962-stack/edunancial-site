import { Offer, OFFER_CATALOG } from "../src/lib/offerCatalog";

export type Variant = "A" | "B";

export function assignVariant(userId?: string): Variant {
  if (!userId) return Math.random() > 0.5 ? "A" : "B";

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash) % 2 === 0 ? "A" : "B";
}

export function getOfferForVariant(
  variant: Variant
): Offer | undefined {
  if (variant === "A") {
    return OFFER_CATALOG[0];
  }

  return OFFER_CATALOG[1];
}
