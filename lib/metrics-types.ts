// lib/metrics-types.ts
// Canonical KPI + metrics definitions (internal only)

export type Region =
  | "US"
  | "AFRICA"
  | "LATAM"
  | "INDIA"
  | "SINGAPORE"
  | "AUSTRALIA"
  | "HONG_KONG"
  | "GLOBAL";

export type RevenueSource =
  | "MEMBERSHIP"
  | "COURSE"
  | "APP"
  | "CONSULTING"
  | "AFFILIATE"
  | "OTHER";

export interface KPIEvent {
  timestamp: string;
  region: Region;
  source: RevenueSource;
  amountUSD: number;
  userLevel: 1 | 2 | 3 | 4 | 5;
  reference?: string;
}

export interface TrafficMetric {
  timestamp: string;
  region: Region;
  page: string;
  source: "DIRECT" | "SEARCH" | "SOCIAL" | "REFERRAL";
}

export interface AppUsageMetric {
  timestamp: string;
  app: "EDUVESTING" | "EDUMATH" | "OTHER";
  region: Region;
  action: string;
}
