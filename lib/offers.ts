import { Region } from "@/lib/core";
import { Conclusion } from "@/lib/conclusions";
import { OFFER_CATALOG, Offer } from "./offerCatalog";

export type OptimizedOffer = {
  primary: Offer;
  secondary?: Offer;
};

export function optimizeOffer(
  region: Region,
  conclusion: Conclusion
): OptimizedOffer {
  const regionOffers = OFFER_CATALOG.filter((o) =>
    o.regions.includes(region)
  );

  // AFRICA: Action-first, income urgency
  if (region === "AFRICA") {
    const action = regionOffers.find((o) => o.type === "action");
    const tool = regionOffers.find((o) => o.type === "tool");

    return {
      primary: action || regionOffers[0],
      secondary: tool,
    };
  }

  // LATAM: Skill + structure
  if (region === "LATAM") {
    const content = regionOffers.find((o) => o.type === "content");
    const membership = regionOffers.find((o) => o.type === "membership");

    return {
      primary: content || regionOffers[0],
      secondary: membership,
    };
  }

  // US: Optimization & scaling
  const membership = regionOffers.find((o) => o.type === "membership");
  const tool = regionOffers.find((o) => o.type === "tool");

  return {
    primary: membership || regionOffers[0],
    secondary: tool,
  };
}
