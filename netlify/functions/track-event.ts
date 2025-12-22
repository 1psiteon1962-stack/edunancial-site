// netlify/functions/track-event.ts

type Handler = (event: any, context: any) => Promise<{
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}>;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing body" }),
    };
  }

  let payload: unknown;

  try {
    payload = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  // Event tracking placeholder
  // Safe for build, safe for runtime
  console.log("Tracked event:", payload);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "ok" }),
  };
};
