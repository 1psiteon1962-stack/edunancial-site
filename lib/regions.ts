// lib/regions.ts

export type Region = {
  id: string;
  name: string;
  description: string;
  languages: string[];
  isActive: boolean;
};

export const regions: Region[] = [
  {
    id: "us",
    name: "United States",
    description:
      "Primary reference market for legal, financial, and operational frameworks.",
    languages: ["en", "es"],
    isActive: true,
  },
  {
    id: "africa",
    name: "Africa",
    description:
      "Multi-market region emphasizing infrastructure formation, demographic growth, and capital absorption models.",
    languages: ["en", "fr", "ar"],
    isActive: true,
  },
  {
    id: "latam",
    name: "Latin America",
    description:
      "Regional markets with hybrid legal systems, currency exposure, and export-driven growth patterns.",
    languages: ["es", "en", "pt"],
    isActive: true,
  },
];

export function resolveRegion(id: string): Region | undefined {
  return regions.find((region) => region.id === id);
}
