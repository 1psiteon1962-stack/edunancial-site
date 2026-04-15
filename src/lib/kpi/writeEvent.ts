import type { InsertableKPIEventRow } from "./types";

export async function writeEvent(row: InsertableKPIEventRow) {
  // Replace later with Supabase / DB
  console.log("KPI EVENT:", row);

  return { success: true };
}
