// netlify/functions/metrics-write.ts
import { Handler } from "@netlify/functions";
import { recordMetric } from "../../lib/metrics-store";
import { MetricRecord } from "../../lib/metrics-types";

export const handler: Handler = async (event) => {
  try {
    const token = event.headers["x-admin-token"];
    if (token !== "INTERNAL_ONLY") {
      return { statusCode: 403, body: "Forbidden" };
    }

    const data = JSON.parse(event.body || "{}") as MetricRecord;

    recordMetric({
      ...data,
      timestamp: Date.now()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch {
    return { statusCode: 400, body: "Invalid payload" };
  }
};
