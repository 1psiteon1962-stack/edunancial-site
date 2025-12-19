export async function trackEvent(event: string, region: string, value?: number) {
  await fetch("/.netlify/functions/track-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, region, value }),
  });
}
