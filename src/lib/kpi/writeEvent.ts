// src/lib/kpi/writeKPIEvent.ts

export type KPIWriteEventInput = {
  event_name: string;
  event_type?: string;
  metadata?: Record<string, unknown>;
};

export async function writeKPIEvent(
  event: KPIWriteEventInput
): Promise<void> {
  console.log("KPI event:", {
    ...event,
    receivedAt: new Date().toISOString(),
  });
}
