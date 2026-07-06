export default function ProfitCenter() {

  const principles = [

    "Revenue is not Profit",

    "Profit Funds Growth",

    "Profit Creates Stability",

    "Profit Creates Opportunity",

    "Profit Pays Employees",

    "Profit Rewards Investors",

    "Profit Builds Wealth",

    "Profit Sustains Businesses",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          PROFIT CENTER
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Business Is About Making Profit

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {principles.map((item) => (

            <div
              key={item}
              className="rounded-xl bg-slate-900 p-8"
            >

              {item}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
