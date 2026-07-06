export default function RealityCheck() {

  const truths = [

    "Hope is not a business plan.",

    "Data beats assumptions.",

    "Reality always wins.",

    "Customers decide value.",

    "Problems create opportunities.",

    "Measure everything possible.",

    "Continuous improvement never ends.",

    "Good decisions compound over time.",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          REALITY CHECK
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Business Reality

        </h2>

        <div className="mt-20 space-y-6">

          {truths.map((truth) => (

            <div
              key={truth}
              className="rounded-xl bg-slate-900 p-8 text-xl"
            >

              {truth}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
