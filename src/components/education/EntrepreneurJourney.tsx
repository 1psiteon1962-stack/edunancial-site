export default function EntrepreneurJourney() {
  const stages = [
    "Recognize the Problem",
    "Research the Market",
    "Validate Demand",
    "Create the Solution",
    "Launch",
    "Measure Performance",
    "Improve Continuously",
    "Scale Responsibly",
  ];

  return (
    <section className="bg-[#08101f] py-24">
      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          ENTREPRENEUR JOURNEY
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Build Businesses Systematically
        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {stages.map((stage, index) => (

            <div
              key={stage}
              className="rounded-xl bg-slate-900 p-8"
            >

              <div className="font-bold text-yellow-400">

                Stage {index + 1}

              </div>

              <h3 className="mt-4 text-2xl font-black">

                {stage}

              </h3>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}
