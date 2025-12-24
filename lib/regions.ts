export type Region = "US" | "AFRICA" | "LATAM";

export function getRegionFromPath(pathname: string): Region {
  if (pathname.startsWith("/africa")) return "AFRICA";
  if (pathname.startsWith("/latam")) return "LATAM";
  return "US";
}
