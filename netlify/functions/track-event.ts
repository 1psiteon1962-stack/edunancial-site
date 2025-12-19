import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const data = JSON.parse(event.body || "{}");

  const record = {
    event: data.event,
    region: data.region,
    value: data.value ?? null,
    timestamp: new Date().toISOString(),
  };

  // For now: log-based persistence (Netlify-safe)
  console.log("KPI_EVENT", JSON.stringify(record));

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
