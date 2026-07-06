export default function InvestmentAnalyst() {

  const investments = [

    "Stocks",

    "ETFs",

    "Options",

    "Real Estate",

    "Businesses",

    "Private Equity",

    "Precious Metals",

    "Alternative Investments",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          AI INVESTMENT ANALYST

        </p>

        <h2 className="mt-6 text-5xl font-black">

          Investment Intelligence

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {investments.map((investment)=>(

            <div key={investment} className="rounded-xl bg-slate-900 p-8">

              {investment}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
