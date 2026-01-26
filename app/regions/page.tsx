// app/regions/page.tsx

export const REGIONS = {
  us: { code: "us", name: "United States", enabled: true },
  caribbean: { code: "caribbean", name: "Caribbean", enabled: true },
  europe: { code: "europe", name: "Europe", enabled: true },
  mena: { code: "mena", name: "Middle East & North Africa", enabled: true },
  asia: { code: "asia", name: "Asia", enabled: true },
  africa: { code: "africa", name: "Africa", enabled: true },
  latin: { code: "latin", name: "Latin America", enabled: true },
} satisfies Record<
  string,
  { code: string; name: string; enabled: boolean }
>;

export default function RegionsIndexPage() {
  const enabledRegions = Object.entries(REGIONS).filter(
    ([_, region]) => region.enabled
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-bold">Regions</h1>

      <p className="mt-4 text-gray-600">
        Select a region to explore localized education, structure, and
        jurisdictional strategy.
      </p>

      <ul className="mt-8 space-y-3">
        {enabledRegions.map(([_, region]) => (
          <li
            key={region.code}
            className="rounded-lg border p-4 hover:shadow-sm"
          >
            <a
              href={`/regions/${region.code}`}
              className="text-lg font-semibold"
            >
              {region.name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
