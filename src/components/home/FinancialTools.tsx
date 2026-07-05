export default function FinancialTools() {

  const tools = [

    "Budget Calculator",

    "Debt Calculator",

    "Net Worth Calculator",

    "Emergency Fund Calculator",

    "Retirement Calculator",

    "Mortgage Calculator",

    "Investment Calculator",

    "Business KPI Calculator",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          FINANCIAL TOOLS
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Practical Tools For Better Decisions

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {tools.map((tool) => (

            <div
              key={tool}
              className="rounded-xl bg-slate-900 p-8"
            >

              {tool}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
