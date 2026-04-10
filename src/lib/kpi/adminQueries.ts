// COMPLETE KPI ADMIN QUERY UTILITIES (FIXES missing fetchEventsCSV + typing)

export type KpiRow = Record<string, string | number | boolean | null>;

/**
 * Convert generic data to CSV
 */
export function exportToCsv(data: KpiRow[]): string {
  if (!data || data.length === 0) return "";

  const headers = Object.keys(data[0]).join(",");

  const rows = data
    .map((row: KpiRow) =>
      Object.values(row)
        .map((value) => `"${String(value ?? "")}"`)
        .join(",")
    )
    .join("\n");

  return `${headers}\n${rows}`;
}

/**
 * REQUIRED EXPORT — this is what your route.ts is trying to import
 * You can later replace the mock data with real Supabase queries
 */
export async function fetchEventsCSV(): Promise<string> {
  try {
    // 🔒 SAFE FALLBACK DATA (prevents crashes if DB not wired yet)
    const mockData: KpiRow[] = [
      {
        event_type: "page_view",
        region: "us",
        fingerprint: "abc123",
        created_at: new Date().toISOString(),
      },
      {
        event_type: "click",
        region: "latam",
        fingerprint: "xyz789",
        created_at: new Date().toISOString(),
      },
    ];

    return exportToCsv(mockData);
  } catch (error) {
    console.error("fetchEventsCSV ERROR:", error);
    return "";
  }
}
