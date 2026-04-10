import { supabaseAdmin } from "./supabaseAdmin";

export async function fetchEventsCSV() {
  const { data, error } = await supabaseAdmin
    .from("events")
    .select("*");

  if (error) {
    throw error;
  }

  if (!data) return "";

  const headers = Object.keys(data[0]).join(",");

  const rows = data.map((row) =>
    Object.values(row)
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );

  return [headers, ...rows].join("\n");
}
