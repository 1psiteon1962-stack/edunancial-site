// lib/regions.ts

/* =========================
   REGION IDENTIFIERS
========================= */

export const REGION_KEYS = [
  "us",
  "latam",
  "caribbean",
  "europe",
  "africa",
  "mena",
  "asia",
  "asia-pacific",
  "asia-emerging",
] as const;

/* =========================
   REGION TYPE
========================= */

export type Region = (typeof REGION_KEYS)[number];

/* =========================
   REGION METADATA (OPTIONAL)
========================= */

export type RegionMeta = {
  id: Region;
  label: string;
};

export const regions: RegionMeta[] = [
  { id: "us", label: "United States" },
  { id: "latam", label: "Latin America" },
  { id: "caribbean", label: "Caribbean" },
  { id: "europe", label: "Europe" },
  { id: "africa", label: "Africa" },
  { id: "mena", label: "Middle East & North Africa" },
  { id: "asia", label: "Asia" },
  { id: "asia-pacific", label: "Asia Pacific" },
  { id: "asia-emerging", label: "Emerging Asia" },
];
