import { listApprovedFilesByDestination } from "@/lib/admin-content/service";

export const MARKETPLACE_CATEGORIES = [
  "books",
  "courses",
  "templates",
  "downloads",
  "software",
  "tools",
  "other-digital-products",
] as const;

export type MarketplaceCategory = (typeof MARKETPLACE_CATEGORIES)[number];

export interface MarketplaceItem {
  id: string;
  title: string;
  category: MarketplaceCategory;
  source: "legacy-books" | "upload";
  language: string;
  destination: string;
}

const LEGACY_ITEMS: MarketplaceItem[] = [
  "Wealth Building the RED, WHITE & BLUE Way",
  "Business Is About Making Profit",
  "Economic Self Defense",
  "Financial Competency",
].map((title) => ({
  id: `legacy-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  title,
  category: "books" as const,
  source: "legacy-books" as const,
  language: "en",
  destination: "legacy/books",
}));

function isMarketplaceCategory(value: string): value is MarketplaceCategory {
  return MARKETPLACE_CATEGORIES.includes(value as MarketplaceCategory);
}

function titleFromFilename(filename: string) {
  const stem = filename.replace(/\.[^.]+$/, "");
  return stem
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function getMarketplaceItems(): Promise<MarketplaceItem[]> {
  try {
    const files = await listApprovedFilesByDestination("marketplace");
    const uploaded = files.map((file) => {
      const parts = file.classification.destination.split("/");
      const category = parts[2];
      const language = parts[3] ?? file.metadata.language;
      return {
        id: file.id,
        title: file.metadata.title?.trim() || titleFromFilename(file.normalizedFilename),
        category: isMarketplaceCategory(category) ? category : "other-digital-products",
        source: "upload" as const,
        language,
        destination: file.classification.destination,
      };
    });

    const seen = new Set<string>();
    return [...uploaded, ...LEGACY_ITEMS].filter((item) => {
      const key = `${item.category}:${item.title.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    return LEGACY_ITEMS;
  }
}
