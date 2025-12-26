import { Region } from "@/lib/core";
import { Offer } from "@/lib/offerCatalog";

export type CheckoutPayload = {
  offerId: string;
  priceUSD: number;
  region: Region;
};

export function getCheckoutUrl(payload: CheckoutPayload): string {
  const base = "/checkout";

  const params = new URLSearchParams({
    offer: payload.offerId,
    price: payload.priceUSD.toString(),
    region: payload.region,
  });

  return `${base}?${params.toString()}`;
}
