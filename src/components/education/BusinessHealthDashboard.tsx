export default function BusinessHealthDashboard() {

  const metrics = [

    "Revenue Trend",

    "Profit Trend",

    "Cash Position",

    "Customer Growth",

    "Average Sale",

    "Gross Margin",

    "Net Margin",

    "Inventory Turnover",

    "Employee Productivity",

    "ROI",

    "Break-even",

    "Overall Health Score",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          BUSINESS HEALTH
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Business Health Dashboard

        </h2>

        <div className="mt-20 grid gap-6 md:grid-cols-3 lg:grid-cols-4">

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
