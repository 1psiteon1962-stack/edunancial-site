/* ADMIN KPI QUERY UTILITIES
   Updated to match the route handler which passes an options object
   to fetchEventsCSV().
*/

export type FetchEventsCsvOptions = {
  days?: number;
  site_region?: string | null;
  site_id?: string | null;
};

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
Fetch KPI events and return CSV.
Accepts filtering options from the admin route.
*/

export async function fetchEventsCSV({
  days = 30,
  site_region = null,
  site_id = null,
}: FetchEventsCsvOptions = {}): Promise<string> {

  /*
  This placeholder implementation allows the build to succeed
  until the KPI database layer is connected.

  When the KPI DB is wired, replace this section with the
  actual query filtering by:
  - days
  - site_region
  - site_id
  */

  const rows: Row[] = [];

  return rowsToCSV(rows);
}
