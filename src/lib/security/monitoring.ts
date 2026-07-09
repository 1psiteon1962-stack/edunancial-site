import { getSecurityEnvironmentStatus } from "./env";

export function writeMonitoringEvent(entry: {
  category: string;
  metadata?: Record<string, unknown>;
}) {
  console.info(
    JSON.stringify({
      type: "monitoring",
      category: entry.category,
      metadata: entry.metadata ?? {},
      timestamp: new Date().toISOString(),
    })
  );
}

export function getReadinessSnapshot() {
  const env = getSecurityEnvironmentStatus();

  return {
    env,
    monitoringReady: true,
    timestamp: new Date().toISOString(),
  };
}
