export default function BusinessMetricsGrid() {

  const metrics = [

    "Revenue",

    "Gross Profit",

    "Net Profit",

    "Gross Margin",

    "Net Margin",

    "Cash Flow",

    "ROI",

    "Break-even",

    "Customer Acquisition Cost",

    "Customer Lifetime Value",

    "Inventory",

    "Productivity",

    "KPIs",

    "Pricing",

    "Labor Cost",

    "Growth Rate",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-5xl font-black">

          Every Entrepreneur Should Know These Numbers

        </h2>

        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {metrics.map((metric) => (

            <div
              key={metric}
              className="rounded-xl bg-slate-900 p-6"
            >

              {metric}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
