// lib/content-resolver.ts
// Resolves content source based on region
// U.S. is always authoritative

import { resolveRegion, Region } from "./regions";

export type PageContent = {
  heroTitle: string;
  heroBody: string;
};

const usContent: PageContent = {
  heroTitle: "Financial Literacy for the Real World",
  heroBody:
    "Understand money, capital, risk, and opportunity — not theory, but practical financial literacy.",
};

const africaContent: PageContent = {
  heroTitle: "Building Financial Strength Across Africa",
  heroBody:
    "Access financial literacy tools designed for growth, entrepreneurship, and cross-border opportunity.",
};

const asiaContent: PageContent = {
  heroTitle: "Financial Literacy for a Global Economy",
  heroBody:
    "From India to Singapore to Australia — understand capital, growth, and global opportunity.",
};

export function getPageContent(hostname?: string): PageContent {
  const region: Region = resolveRegion(hostname);

  switch (region) {
    case "africa":
      return africaContent;
    case "asia":
      return asiaContent;
    case "us":
    default:
      return usContent;
  }
}
