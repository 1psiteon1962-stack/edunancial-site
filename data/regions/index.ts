// data/regions/index.ts
import { US_REGION } from "./us";

export const REGIONS = {
  us: US_REGION,
};

export type RegionKey = keyof typeof REGIONS;
