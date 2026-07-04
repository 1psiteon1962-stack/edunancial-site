export default function WhyEdunancial() {
  const reasons = [
    "Structured Learning",
    "Competency Measurement",
    "Practical Worksheets",
    "Business KPIs",
    "AI Coaching",
    "Professional Marketplace",
    "Global Expansion",
    "Lifetime Learning",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Why Edunancial?
      </h2>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {reasons.map((reason) => (

          <div
            key={reason}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 text-center"
          >

            {reason}

          </div>

        ))}

      </div>

    </section>
  );
}
