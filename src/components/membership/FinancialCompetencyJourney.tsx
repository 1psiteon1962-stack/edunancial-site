export default function FinancialCompetencyJourney() {
  const journey = [
    "Learn",
    "Practice",
    "Measure",
    "Improve",
    "Repeat",
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">

      <div className="rounded-2xl border border-blue-700 bg-blue-950/20 p-10">

        <h2 className="text-4xl font-bold">
          Financial Competency Is A Journey
        </h2>

        <div className="mt-12 flex flex-wrap justify-center gap-6">

          {journey.map((step) => (

            <div
              key={step}
              className="rounded-xl border border-slate-700 px-8 py-5"
            >
              {step}
            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
