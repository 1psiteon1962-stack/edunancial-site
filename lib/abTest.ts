import { Offer } from "@/lib/offerCatalog";

export type Variant = "A" | "B";

export function assignVariant(userId: string): Variant {
  const hash = userId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return hash % 2 === 0 ? "A" : "B";
}

export function selectOfferByVariant(
  variant: Variant,
  primary: Offer,
  secondary?: Offer
): Offer {
  return variant === "A" ? primary : secondary || primary;
}
