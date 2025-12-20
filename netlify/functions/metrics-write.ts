import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const adminToken = event.headers["x-admin-token"];
  if (adminToken !== process.env.ADMIN_METRICS_TOKEN) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const payload = JSON.parse(event.body || "{}");

  // Placeholder persistence
  console.log("METRICS RECEIVED:", payload);

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "recorded" }),
  };
};
