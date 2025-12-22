// netlify/functions/metrics-write.ts

type Handler = (event: any, context: any) => Promise<{
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}>;

import { recordMetric } from "../../lib/metrics-store";
import type { MetricRecord } from "../../lib/metrics-types";

const ADMIN_TOKEN = process.env.ADMIN_METRICS_TOKEN;

export const handler: Handler = async (event) => {
  const auth = event.headers?.authorization || event.headers?.Authorization;

  if (!ADMIN_TOKEN || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing body" }),
    };
  }

  let payload: MetricRecord;

  try {
    payload = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  try {
    recordMetric(payload);
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to record metric" }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "ok" }),
  };
};
