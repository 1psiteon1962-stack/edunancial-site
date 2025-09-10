export const handler = async () => {
  const appId = process.env.SQUARE_APP_ID;
  const locationId = process.env.SQUARE_LOCATION_ID;
  if (!appId || !locationId) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing Square config" }) };
  }
  return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ appId, locationId }) };
};
