export type LanguageCode =
  | "en"
  | "es"
  | "ko"
  | "ja"
  | "tl"
  | "ar"
  | "pt"
  | "fr";

export type Region = {
  slug: string;
  name: string;
  currency: string;
  supportedLanguages: LanguageCode[];
  defaultLanguage: LanguageCode;
};

export const regions: Region[] = [
  {
    slug: "us",
    name: "United States",
    currency: "USD",
    supportedLanguages: [
      "en",
      "es",
      "ko",
      "ja",
      "tl",
      "ar",
      "pt",
      "fr"
    ],
    defaultLanguage: "en"
  }
];

export function isRegionSlug(value: unknown): value is string {
  return typeof value === "string" &&
    regions.some(r => r.slug === value);
}

export function getRegion(slug: string) {
  return regions.find(r => r.slug === slug);
}
