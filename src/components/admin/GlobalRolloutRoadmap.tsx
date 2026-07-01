export default function GlobalRolloutRoadmap() {

  const roadmap = [
    "North America",
    "Latin America",
    "Caribbean",
    "Europe",
    "Africa",
    "Asia-Pacific",
    "Middle East",
  ];

  return (
    <section className="rounded-xl bg-slate-900 p-8">

      <h2 className="text-3xl font-black text-white">
        Global Rollout Roadmap
      </h2>

      <div className="mt-8">

        {roadmap.map((region, index) => (

          <div
            key={region}
            className="mb-4 rounded-lg bg-slate-800 p-4"
          >

            <div className="flex justify-between">

              <span className="font-bold text-white">
                {region}
              </span>

              <span className="text-blue-400">
                Phase {index + 1}
              </span>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}
