import { LevelId } from "./levels";

export type Level = LevelId;

export interface Offer {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  comingSoon?: boolean;
}

export const LEVEL_OFFERS: Record<LevelId, Offer[]> = {
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
