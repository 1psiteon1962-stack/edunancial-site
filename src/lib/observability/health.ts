export function getLivenessPayload() {
  return {
    status: "alive",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
  };
}

export function getReadinessPayload() {
  const airtableConfigured = Boolean(
    process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID
  );
  const requireAirtableForReadiness =
    process.env.REQUIRE_AIRTABLE_FOR_READINESS === "true";
  const ready = !requireAirtableForReadiness || airtableConfigured;

  return {
    status: ready ? "ready" : "not_ready",
    ready,
    timestamp: new Date().toISOString(),
    dependencies: {
      airtable: airtableConfigured ? "configured" : "not_configured",
    },
  };
}
