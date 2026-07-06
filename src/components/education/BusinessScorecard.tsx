export default function BusinessScorecard() {

  const categories = [

    "Leadership",

    "Marketing",

    "Sales",

    "Operations",

    "Cash Flow",

    "Profit",

    "Customer Satisfaction",

    "Growth",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          BUSINESS SCORECARD
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Measure Your Business

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {categories.map((category) => (

            <div
              key={category}
              className="rounded-xl bg-slate-900 p-8"
            >

              {category}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
