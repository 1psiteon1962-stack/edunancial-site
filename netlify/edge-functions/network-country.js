/** Netlify edge geo is authoritative for public location recommendations only.
 * Never use this response to authorize checkout or to set payment amounts.
 */
export default async function handler(_request, context) {
  const countryCode = String(context.geo?.country?.code ?? "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(countryCode) || countryCode === "XX") {
    return Response.json({ success: false, detected: false, error: "Network country unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store, private" } });
  }
  const profile = {
    DO: { currency: "DOP", timezone: "America/Santo_Domingo" },
    ES: { currency: "EUR", timezone: "Europe/Madrid" },
    US: { currency: "USD", timezone: "America/New_York" },
  }[countryCode];
  return Response.json({
    success: true, detected: true, countryCode, source: "netlify-edge-geo",
    currency: profile?.currency ?? null,
    timezone: context.geo?.timezone || profile?.timezone || null,
  }, { headers: { "Cache-Control": "no-store, private" } });
}
export const config = { path: "/api/location/network-country" };
