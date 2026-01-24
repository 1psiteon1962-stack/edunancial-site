// src/lib/airtable.ts

export type KPIRecord = {
  userId: string;
  event: string;
  createdAt: string;
};

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || "";
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "";
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE || "kpi";

export async function writeToAirtable(record: KPIRecord): Promise<void> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn("Airtable not configured — skipping write.");
    return;
  }

  await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: record,
      }),
    }
  );
}
