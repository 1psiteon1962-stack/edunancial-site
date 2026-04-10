import { Level } from "./levels";

/**
 * 🔥 CRITICAL: Re-export Level so components can import from here
 */
export type { Level };

export interface Offer {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  comingSoon?: boolean;
}

export const LEVEL_OFFERS: Record<Level, Offer[]> = {
  free: [],
  starter: [
    {
      id: "starter-1",
      title: "Starter Access",
      description: "Basic tools and education",
      priceUSD: 9,
    },
  ],
  builder: [
    {
      id: "builder-1",
      title: "Builder Package",
      description: "Advanced tools and systems",
      priceUSD: 29,
    },
  ],
  operator: [],
  owner: [],
  investor: [],
};
