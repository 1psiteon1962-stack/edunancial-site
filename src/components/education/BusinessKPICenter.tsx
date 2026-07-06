export default function BusinessKPICenter() {

  const kpis = [

    "Revenue",

    "Gross Profit",

    "Net Profit",

    "Gross Margin",

    "Net Margin",

    "Cash Flow",

    "Operating Expenses",

    "Accounts Receivable",

    "Accounts Payable",

    "Inventory",

    "Average Sale",

    "Customer Acquisition Cost",

    "Customer Lifetime Value",

    "Employee Productivity",

    "ROI",

    "Break-even Analysis",

  ];

  return (

    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          KPI CENTER
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Know Your Numbers

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {kpis.map((kpi) => (

            <div
              key={kpi}
              className="rounded-xl bg-slate-900 p-8"
            >

              {kpi}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
