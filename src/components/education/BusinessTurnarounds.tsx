export default function BusinessTurnarounds() {

  const actions = [

    "Reduce Expenses",

    "Increase Gross Margin",

    "Improve Cash Flow",

    "Raise Prices Strategically",

    "Improve Operations",

    "Pivot Business Model",

    "Measure KPIs",

    "Scale Carefully",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-5xl font-black">

          Turning Businesses Around

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {actions.map((action) => (

            <div
              key={action}
              className="rounded-xl bg-slate-900 p-8"
            >

              {action}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
