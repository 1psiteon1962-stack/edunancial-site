export type RegionMeta = {
  slug: string;
  name: string;
  clientModules: string[];
};

export const regions: RegionMeta[] = [
  {
    slug: "us",
    name: "United States",
    clientModules: ["core", "legal", "education"]
  },
  {
    slug: "global",
    name: "Global",
    clientModules: ["core", "education"]
  }
];
