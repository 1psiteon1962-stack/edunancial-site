import { Region, Language } from "./i18n";

export type WealthTrack = "real_estate" | "paper_assets" | "business";

export interface CurriculumItem {
  id: string;
  title: string;
  summary: string;
  readingLevel: number; // U.S. grade equivalent
}

export const regionCurriculumContent: Record<
  Region,
  Record<WealthTrack, CurriculumItem[]>
> = {
  us: {
    real_estate: [
      {
        id: "re-101",
        title: "How Property Creates Wealth",
        summary: "Cash flow, leverage, and appreciation explained simply.",
        readingLevel: 8,
      },
    ],
    paper_assets: [
      {
        id: "pa-101",
        title: "What Stocks Actually Represent",
        summary: "Ownership, not gambling.",
        readingLevel: 8,
      },
    ],
    business: [
      {
        id: "biz-101",
        title: "Why Businesses Outperform Jobs",
        summary: "Control, scalability, and income systems.",
        readingLevel: 8,
      },
    ],
  },

  mena: { real_estate: [], paper_assets: [], business: [] },
  latam: { real_estate: [], paper_assets: [], business: [] },
  eu: { real_estate: [], paper_assets: [], business: [] },
};
