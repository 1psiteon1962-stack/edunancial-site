import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const data = JSON.parse(event.body || "{}");

  const record = {
    amount: data.amount,
    currency: data.currency || "USD",
    product: data.product,
    region: data.region,
    timestamp: new Date().toISOString(),
  };

  console.log("REVENUE_EVENT", JSON.stringify(record));

  return {
    statusCode: 200,
    body: JSON.stringify({ logged: true }),
  };
};
