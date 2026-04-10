// TYPE-SAFE KPI EXPORT UTILITY (FIXES noImplicitAny BUILD FAILURE)

export type KpiRow = Record<string, string | number | boolean | null>;

// Convert KPI data to CSV
export function exportToCsv(data: KpiRow[]): string {
  if (!data || data.length === 0) {
    return "";
  }

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
