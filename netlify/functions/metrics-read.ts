import type { Handler } from "@netlify/functions";

const ADMIN_TOKEN = process.env.ADMIN_METRICS_TOKEN;

export const handler: Handler = async (event) => {
  // Block if no token configured
  if (!ADMIN_TOKEN) {
    return {
      statusCode: 500,
      body: "Metrics not configured",
    };
  }

  // Require admin token
  const incomingToken =
    event.headers["x-admin-token"] ||
    event.headers["X-Admin-Token"];

  if (incomingToken !== ADMIN_TOKEN) {
    return {
      statusCode: 401,
      body: "Unauthorized",
    };
  }

  // Example metrics payload (internal use only)
  const metrics = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.CONTEXT || "unknown",
    region: event.headers["x-nf-country"] || "unknown",
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(metrics),
  };
};
