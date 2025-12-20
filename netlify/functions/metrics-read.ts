// netlify/functions/metrics-read.ts
import { Handler } from "@netlify/functions";
import { getAllMetrics, summarizeMetrics } from "../../lib/metrics-store";

export const handler: Handler = async (event) => {
  const token = event.headers["x-admin-token"];
  if (token !== "INTERNAL_ONLY") {
    return { statusCode: 403, body: "Forbidden" };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      summary: summarizeMetrics(),
      records: getAllMetrics()
    })
  };
};
