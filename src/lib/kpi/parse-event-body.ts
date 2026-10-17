/** Only JSON records can carry analytics events. Malformed requests must be rejected, not logged as server failures. */
export function parseKpiEventBody(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}
