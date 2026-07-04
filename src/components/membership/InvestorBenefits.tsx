export default function InvestorBenefits() {

  const items = [

    "Investment Fundamentals",

    "Portfolio Tracking",

    "Risk Analysis",

    "ROI Calculators",

    "Real Estate Education",

    "Stock Market Education",

    "Financial Planning",

    "Long-Term Wealth Building",

  ];

  return (

    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">

        Built For Investors

      </h2>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {items.map((item) => (

          <div
            key={item}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6"
          >

            {item}

          </div>

        ))}

      </div>

    </section>

  );

}
