export type Region = {
  code: string;
  name: string;
  defaultLanguage: string;
  languages: string[];
};

const REGIONS: Region[] = [
  {
    code: "us",
    name: "United States",
    defaultLanguage: "en",
    languages: ["en", "es", "fr", "de"],
  },
  {
    code: "eu",
    name: "Europe",
    defaultLanguage: "en",
    languages: ["en", "fr", "de", "it"],
  },
  {
    code: "mena",
    name: "Middle East & North Africa",
    defaultLanguage: "ar",
    languages: ["ar", "en", "fr"],
  },
];

export function getRegion(code: string): Region | undefined {
  return REGIONS.find((r) => r.code === code);
}
