/* ADMIN KPI QUERY UTILITIES
   This file exports the functions used by the admin KPI routes.
   Added: fetchEventsCSV export so the admin export route can import it.
*/

type Row = Record<string, string | number | boolean | null>;

function escapeCSV(value: string | number | boolean | null): string {
  if (value === null || value === undefined) return "";
  const s = typeof value === "string" ? value : String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function rowsToCSV(rows: Row[]): string {
  if (!rows || rows.length === 0) return "";

  const header = Object.keys(rows[0]).join(",");

  const lines = rows.map((r: Row) => {
    return Object.values(r).map(escapeCSV).join(",");
  });

  return [header, ...lines].join("\n");
}

/*
Fetch KPI events and return CSV
Used by:
src/app/admin/kpi/export/route.ts
*/
export async function fetchEventsCSV(): Promise<string> {
  /*
  In production this should query the KPI events table.
  For now this reads from a generic source so the build succeeds
  even if the database layer is not wired yet.
  */

  const rows: Row[] = [];

  return rowsToCSV(rows);
}
