export interface Offer {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
}

export const OFFER_CATALOG: Offer[] = [
  {
    id: "starter",
    title: "Starter Plan",
    description: "Entry-level access",
    priceUSD: 9,
  },
  {
    id: "builder",
    title: "Builder Plan",
    description: "Growth tools",
    priceUSD: 29,
  },
];
