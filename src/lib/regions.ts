export type Region = {
  slug: string;
  name: string;
  currency: string;
  clientModules: string[];
};

export const regions: Region[] = [
  {
    slug: "us",
    name: "United States",
    currency: "USD",
    clientModules: [
      "Financial Literacy",
      "Options Trading",
      "Real Estate",
      "Business Ownership",
      "AI & Automation"
    ]
  }
];

export function getRegion(slug: string): Region | undefined {
  return regions.find((r) => r.slug === slug);
}
