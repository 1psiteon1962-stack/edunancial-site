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
    PR: { currency: "USD", timezone: "America/Puerto_Rico" },
    JM: { currency: "JMD", timezone: "America/Jamaica" },
    BB: { currency: "BBD", timezone: "America/Barbados" },
    HT: { currency: "HTG", timezone: "America/Port-au-Prince" },
    TC: { currency: "USD", timezone: "America/Grand_Turk" },
    TT: { currency: "TTD", timezone: "America/Port_of_Spain" },
    GP: { currency: "EUR", timezone: "America/Guadeloupe" },
    MQ: { currency: "EUR", timezone: "America/Martinique" },
    AW: { currency: "AWG", timezone: "America/Aruba" },
    MX: { currency: "MXN", timezone: "America/Mexico_City" },
    BR: { currency: "BRL", timezone: "America/Sao_Paulo" },
    CA: { currency: "CAD", timezone: "America/Toronto" },
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
