export default function GlobalLaunchRoadmap() {
  const phases = [
    {
      title: "Phase 1",
      region: "North America",
      status: "LIVE",
      countries: "United States • Canada"
    },
    {
      title: "Phase 2",
      region: "Africa",
      status: "COMING SOON",
      countries: "Uganda • Kenya • Nigeria • Ghana • Tanzania"
    },
    {
      title: "Phase 3",
      region: "Latin America & Caribbean",
      status: "PLANNED",
      countries: "Dominican Republic • Puerto Rico • Mexico • Colombia • Brazil"
    },
    {
      title: "Phase 4",
      region: "Asia",
      status: "PLANNED",
      countries: "Philippines • India • Singapore"
    },
    {
      title: "Phase 5",
      region: "Middle East",
      status: "PLANNED",
      countries: "UAE • Saudi Arabia • Qatar"
    },
    {
      title: "Phase 6",
      region: "Europe",
      status: "PLANNED",
      countries: "Spain • Portugal • France • Germany • Italy"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-5xl font-black text-white mb-10">
        Global Rollout Roadmap
      </h2>

      <div className="grid gap-6 lg:grid-cols-2">
        {phases.map((phase) => (
          <div
            key={phase.title}
            className="rounded-2xl bg-slate-900 border border-slate-700 p-8"
          >
            <div className="text-blue-400 font-bold text-xl">
              {phase.title}
            </div>

            <h3 className="text-3xl font-black text-white mt-3">
              {phase.region}
            </h3>

            <p className="mt-4 text-green-400 font-semibold">
              {phase.status}
            </p>

            <p className="mt-5 text-gray-300">
              {phase.countries}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
