// lib/regions.ts

import { Language } from "./language";

export type Region = {
  id: "US" | "LATAM" | "AFRICA";
  name: string;
  defaultLanguage: Language;
};

export const regions: Region[] = [
  {
    id: "US",
    name: "United States",
    defaultLanguage: "en",
  },
  {
    id: "LATAM",
    name: "Latin America",
    defaultLanguage: "es",
  },
  {
    id: "AFRICA",
    name: "Africa",
    defaultLanguage: "en",
  },
];

/**
 * Named export required by content-resolver.
 * No defaults. No ambiguity.
 */
export function resolveRegion(id: string): Region | undefined {
  return regions.find((region) => region.id === id);
}
