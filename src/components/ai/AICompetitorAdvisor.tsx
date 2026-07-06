export default function AICompetitorAdvisor() {

  const areas = [

    "Products",

    "Pricing",

    "Marketing",

    "Customer Reviews",

    "Strengths",

    "Weaknesses",

    "Market Position",

    "Growth Strategy",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          AI COMPETITOR ANALYSIS
        </p>

        <h2 className="mt-6 text-5xl font-black">

          Learn From Your Competition

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {areas.map((area)=>(

            <div
              key={area}
              className="rounded-xl bg-slate-900 p-8"
            >

              {area}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
