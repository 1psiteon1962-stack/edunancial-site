export type RegionMeta = {
  name: string;
  description: string;
  languages: readonly string[];
  enabled: boolean;
};

export const REGIONS: Record<string, RegionMeta> = {
  us: {
    name: "United States",
    description:
      "Structured information and system-level insights tailored to U.S. financial, business, and regulatory environments.",
    languages: ["en", "es"],
    enabled: true,
  },
};
