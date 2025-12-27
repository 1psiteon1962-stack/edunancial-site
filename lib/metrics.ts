// lib/metrics.ts

export type MetricEvent = {
  id: string;
  type: string;
  timestamp: number;
  payload?: Record<string, any>;
};

let events: MetricEvent[] = [];

export function getEvents(): MetricEvent[] {
  return events;
}

export function clearEvents(): void {
  events = [];
}

export function recordEvent(event: MetricEvent): void {
  events.push(event);
}
