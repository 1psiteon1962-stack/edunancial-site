// lib/metrics-types.ts

export type Region =
  | "us"
  | "africa"
  | "india"
  | "asia"
  | "global";

export type MetricEvent =
  | "visit"
  | "signup"
  | "level_upgrade"
  | "purchase";

export type MetricRecord = {
  timestamp: number;
  region: Region;
  event: MetricEvent;
  level?: number;
  amount?: number; // placeholder revenue
};
