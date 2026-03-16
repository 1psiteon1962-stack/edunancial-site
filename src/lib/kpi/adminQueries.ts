/* KPI ADMIN QUERIES
   This version fixes the TypeScript build error caused by
   an implicit 'any' type in the rows.map callback.
*/

type Row = Record<string, string | number | boolean | null>;

export function buildCSV(rows: Row[]): string {
  const header = [
    "date",
    "metric",
    "value"
  ].join(",");

  const lines = rows.map((r: Row) => {
    const esc = (v: string | number | boolean | null) => {
      if (v === null || v === undefined) return "";
      const s = typeof v === "string" ? v : String(v);
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    return [
      esc(r.date),
      esc(r.metric),
      esc(r.value)
    ].join(",");
  });

  return [header, ...lines].join("\n");
}
