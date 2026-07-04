export default function CountryAvailability() {
  const regions = [
    "United States",
    "Canada",
    "Uganda",
    "Nigeria",
    "Dominican Republic",
    "Spain",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Current Rollout
      </h2>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {regions.map((region) => (
          <div
            key={region}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 text-center"
          >
            <h3 className="text-xl font-bold">
              {region}
            </h3>

            <p className="mt-4 text-green-400">
              Planned Launch
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
