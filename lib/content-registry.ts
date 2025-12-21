// lib/content-registry.ts

import type { Region } from "./regions";

export interface Content {
  title: string;
  description: string;
}

const CONTENT_BY_REGION: Record<Region, Content> = {
  NA: {
    title: "Financial Literacy for the Next Generation",
    description: "Education and tools designed for U.S. entrepreneurs."
  },
  EU: {
    title: "European Financial Foundations",
    description: "Localized knowledge for EU markets."
  },
  LATAM: {
    title: "Educación Financiera",
    description: "Recursos para América Latina."
  },
  AFRICA: {
    title: "Building Wealth in Emerging Markets",
    description: "Foundational financial education for Africa."
  },
  ASIA: {
    title: "Asia-Pacific Financial Strategy",
    description: "Education tailored for Asian markets."
  }
};

export function getContent(region: Region): Content {
  return CONTENT_BY_REGION[region];
}
