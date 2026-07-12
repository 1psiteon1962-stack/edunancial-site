"use client";

import { useRouter } from "next/navigation";

const REGION_ROUTES: Record<string, string> = {
  "North America": "/north-america",
  "Latin America": "/latin-america",
  "Latin America 2A (Spanish)": "/latin-america-2a",
  "Latin America 2B (Portuguese)": "/latin-america-2b",
  Caribbean: "/caribbean",
  Africa: "/africa",
  "Middle East": "/middle-east",
  Asia: "/asia",
  Europe: "/europe-2a",
  Oceania: "/oceania",
};

export default function RegionSelector() {
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const route = REGION_ROUTES[event.target.value];
    if (route) {
      router.push(route);
    }
  }

  return (
    <select
      className="rounded-lg border border-white/20 bg-slate-900 p-2 text-white"
      onChange={handleChange}
      defaultValue=""
      aria-label="Select region"
    >
      <option value="" disabled>
        Select Region
      </option>
      {Object.keys(REGION_ROUTES).map((region) => (
        <option key={region} value={region}>
          {region}
        </option>
      ))}
    </select>
  );
}
