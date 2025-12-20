// lib/upgrade-intent.ts

export type UpgradeIntentLevel =
  | "level_1"
  | "level_2"
  | "level_3"
  | "level_4"
  | "level_5";

export interface UpgradeIntentEvent {
  userId?: string;
  region: string;
  currentLevel: UpgradeIntentLevel;
  targetLevel: UpgradeIntentLevel;
  source: "button" | "content" | "assessment" | "video";
  timestamp: number;
}

const intentBuffer: UpgradeIntentEvent[] = [];

export function recordUpgradeIntent(event: UpgradeIntentEvent) {
  intentBuffer.push(event);
}

export function getUpgradeIntentStats() {
  return {
    total: intentBuffer.length,
    byTargetLevel: intentBuffer.reduce<Record<string, number>>((acc, e) => {
      acc[e.targetLevel] = (acc[e.targetLevel] || 0) + 1;
      return acc;
    }, {}),
    byRegion: intentBuffer.reduce<Record<string, number>>((acc, e) => {
      acc[e.region] = (acc[e.region] || 0) + 1;
      return acc;
    }, {}),
  };
}
