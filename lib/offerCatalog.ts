export interface Offer {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  comingSoon?: boolean;
}

export const OFFER_CATALOG: Offer[] = [
  {
    id: "starter-1",
    title: "Starter Offer",
    description: "Entry-level tools and resources",
    priceUSD: 9,
  },
  {
    id: "growth-1",
    title: "Growth Offer",
    description: "Scaling tools and systems",
    priceUSD: 29,
  },
  {
    id: "enterprise-1",
    title: "Enterprise Offer",
    description: "Full platform access",
    priceUSD: 99,
  },
];
