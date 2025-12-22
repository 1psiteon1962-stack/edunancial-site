// netlify/functions/metrics-read.ts

type Handler = (event: any, context: any) => Promise<{
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}>;

const ADMIN_TOKEN = process.env.ADMIN_METRICS_TOKEN;

export const handler: Handler = async (event) => {
  const auth = event.headers?.authorization || event.headers?.Authorization;

  if (!ADMIN_TOKEN || auth !== `Bearer ${ADMIN_TOKEN}`) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "ok",
      timestamp: new Date().toISOString(),
    }),
  };
};
