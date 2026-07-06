export default function DecisionMakingFramework() {

  const framework = [

    "Identify the Problem",

    "Gather Evidence",

    "Know Your Numbers",

    "Develop Alternatives",

    "Evaluate Risk",

    "Make the Decision",

    "Measure the Outcome",

    "Improve Continuously",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          DECISION FRAMEWORK
        </p>

        <h2 className="mt-6 text-6xl font-black">

          A Repeatable Process

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {framework.map((step, index) => (

            <div
              key={step}
              className="rounded-xl bg-slate-900 p-8"
            >

              <p className="font-bold text-yellow-400">

                Step {index + 1}

              </p>

              <h3 className="mt-4 text-2xl font-black">

                {step}

              </h3>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
