export type Region =
  | "us"
  | "latam"
  | "caribbean"
  | "africa"
  | "europe"
  | "asia";

export interface CoreConfig {
  region: Region;
}

export const DEFAULT_REGION: Region = "us";
