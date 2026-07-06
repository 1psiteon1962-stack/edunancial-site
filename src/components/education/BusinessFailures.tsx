export default function BusinessFailures() {

  const failures = [

    "Poor Cash Flow",

    "No Market Demand",

    "Pricing Errors",

    "Poor Inventory Control",

    "Weak Leadership",

    "Growing Too Quickly",

    "Ignoring KPIs",

    "Making Decisions Without Data",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-5xl font-black">

          Why Businesses Fail

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {failures.map((failure) => (

            <div
              key={failure}
              className="rounded-xl bg-slate-900 p-8"
            >

              {failure}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
