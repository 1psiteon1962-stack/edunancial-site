// lib/metrics.ts
export type TimeBucket =
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMI_ANNUAL"
  | "ANNUAL";

export type Region = "US" | "AFRICA" | "ASIA" | "GLOBAL";

export interface MetricEvent {
  event: string;
  region: Region;
  amount?: number;
  level?: number;
  timestamp: number;
}

const memoryStore: MetricEvent[] = [];

export function recordMetric(event: MetricEvent) {
  memoryStore.push(event);
}

export function aggregateMetrics(bucket: TimeBucket) {
  // Placeholder logic — storage backend can change later
  return {
    bucket,
    count: memoryStore.length,
    revenue: memoryStore.reduce((sum, e) => sum + (e.amount ?? 0), 0),
  };
}
