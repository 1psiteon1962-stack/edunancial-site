export default function LearningJourney() {
  const stages = [
    "Discover",
    "Understand",
    "Apply",
    "Measure",
    "Improve",
    "Lead",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Your Learning Journey
      </h2>

      <div className="mt-14 grid gap-6 md:grid-cols-3 lg:grid-cols-6">

        {stages.map((stage) => (

          <div
            key={stage}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 text-center"
          >

            <div className="text-lg font-bold">
              {stage}
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}
