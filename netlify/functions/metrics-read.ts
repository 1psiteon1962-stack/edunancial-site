import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const token = event.headers["x-admin-token"];

  if (token !== process.env.ADMIN_TOKEN) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  // Placeholder: real storage later
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Metrics available via logs or external store",
    }),
  };
};
