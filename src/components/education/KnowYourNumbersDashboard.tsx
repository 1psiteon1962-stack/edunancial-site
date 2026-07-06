export default function KnowYourNumbersDashboard() {

  const kpis = [

    "Revenue",

    "Expenses",

    "Gross Profit",

    "Net Profit",

    "Cash Flow",

    "Customers",

    "Average Sale",

    "Profit Margin",

    "ROI",

    "Break-even",

    "Growth",

    "Productivity",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-5xl font-black">

          Know Your Numbers Dashboard

        </h2>

        <div className="mt-20 grid gap-6 md:grid-cols-3 lg:grid-cols-4">

          {kpis.map((kpi) => (

            <div
              key={kpi}
              className="rounded-xl bg-slate-900 p-6"
            >

              {kpi}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
