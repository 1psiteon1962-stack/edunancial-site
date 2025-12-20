import { Region } from "../payments/payment-config";

export function resolveRegion(hostname?: string): Region {
  if (!hostname) return "GLOBAL";

  const host = hostname.toLowerCase();

  if (host.includes("us.") || host.includes("edunancial.com")) return "US";
  if (host.includes("africa")) return "AFRICA";
  if (host.includes("india")) return "INDIA";
  if (host.includes("latam")) return "LATAM";

  return "GLOBAL";
}
