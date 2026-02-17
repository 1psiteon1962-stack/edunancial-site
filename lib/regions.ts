export type RegionMeta = {
  slug: string;
  code: string;
  name: string;
  clientModules: string[];
};

export const regions: RegionMeta[] = [
  {
    slug: "us",
    code: "us",
    name: "United States",
    clientModules: ["core", "legal", "education"]
  },
  {
    slug: "global",
    code: "global",
    name: "Global",
    clientModules: ["core", "education"]
  }
];
