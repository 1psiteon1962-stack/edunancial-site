export type Region =
  | "us"
  | "africa"
  | "asia"
  | "india"
  | "singapore"
  | "australia"
  | "hongkong";

export const REGION_META: Record<Region, {
  label: string;
  defaultLang: string;
  currency: string;
}> = {
  us: {
    label: "United States",
    defaultLang: "en",
    currency: "USD",
  },
  africa: {
    label: "Africa",
    defaultLang: "en",
    currency: "LOCAL",
  },
  asia: {
    label: "Asia",
    defaultLang: "en",
    currency: "LOCAL",
  },
  india: {
    label: "India",
    defaultLang: "en",
    currency: "INR",
  },
  singapore: {
    label: "Singapore",
    defaultLang: "en",
    currency: "SGD",
  },
  australia: {
    label: "Australia",
    defaultLang: "en",
    currency: "AUD",
  },
  hongkong: {
    label: "Hong Kong",
    defaultLang: "en",
    currency: "HKD",
  },
};

export function resolveRegion(pathname: string): Region {
  if (pathname.startsWith("/africa")) return "africa";
  if (pathname.startsWith("/india")) return "india";
  if (pathname.startsWith("/singapore")) return "singapore";
  if (pathname.startsWith("/australia")) return "australia";
  if (pathname.startsWith("/hongkong")) return "hongkong";
  if (pathname.startsWith("/asia")) return "asia";
  return "us";
}
