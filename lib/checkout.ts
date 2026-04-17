import { Region } from "./core";
import { Offer } from "./offerCatalog";

export type CheckoutPayload = {
  region: Region;
  offer: Offer;
};

export function buildCheckout(payload: CheckoutPayload) {
  return {
    region: payload.region,
    offer: payload.offer,
    timestamp: Date.now(),
  };
}
