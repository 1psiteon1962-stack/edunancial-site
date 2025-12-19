const PRIMARY_ENDPOINT = "https://edunancial.com/.netlify/functions/track-event";

export async function sendMetric(payload: any) {
  await fetch(PRIMARY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
