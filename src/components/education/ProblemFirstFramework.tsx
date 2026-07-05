export default function ProblemFirstFramework() {

  const steps = [

    "Identify the Problem",

    "Validate Demand",

    "Define the Customer",

    "Test Assumptions",

    "Build the Solution",

    "Measure Results",

    "Adjust Based on Reality",

    "Scale Responsibly",

  ];

  return (

    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          PROBLEM-FIRST ENTREPRENEURSHIP
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Start With The Problem

        </h2>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

          Successful businesses solve real problems.
          Products come later.

        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {steps.map((step, index) => (

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
