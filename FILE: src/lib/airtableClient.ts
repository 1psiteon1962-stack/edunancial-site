type AirtableCreateResponse = {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
};

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function airtableUrl(path: string) {
  const baseId = requiredEnv("AIRTABLE_BASE_ID");
  return `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(path)}`;
}

export async function airtableCreateRecord(
  tableName: string,
  fields: Record<string, unknown>
): Promise<AirtableCreateResponse> {
  const apiKey = requiredEnv("AIRTABLE_API_KEY");

  const res = await fetch(airtableUrl(tableName), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
    cache: "no-store",
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Airtable create failed (${res.status}): ${text}`);
  }

  return JSON.parse(text) as AirtableCreateResponse;
}

export async function airtableCreateEvent(
  fields: Record<string, unknown>
): Promise<AirtableCreateResponse | null> {
  const table = process.env.AIRTABLE_TABLE_EVENTS || "Events";

  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.warn("[airtableCreateEvent] Airtable env not set; skipping event write.");
    return null;
  }

  return airtableCreateRecord(table, fields);
}
