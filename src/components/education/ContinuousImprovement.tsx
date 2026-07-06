export default function ContinuousImprovement() {

  const cycle = [

    "Measure",

    "Analyze",

    "Decide",

    "Implement",

    "Review",

    "Improve",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          CONTINUOUS IMPROVEMENT
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Improvement Never Ends

        </h2>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

          Financial competency is a lifelong process of measuring,
          learning, improving and making better decisions.

        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          {cycle.map((step) => (

            <div
              key={step}
              className="rounded-xl bg-slate-900 p-8 text-center"
            >

              {step}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
