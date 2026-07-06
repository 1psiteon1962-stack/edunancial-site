export default function AIOpportunityScanner() {

  const opportunities = [

    "New Markets",

    "New Products",

    "Strategic Partnerships",

    "Acquisitions",

    "Technology",

    "Cost Reduction",

    "Automation",

    "International Expansion",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          AI OPPORTUNITY SCANNER
        </p>

        <h2 className="mt-6 text-5xl font-black">

          Find Your Next Opportunity

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {opportunities.map((item)=>(

            <div
              key={item}
              className="rounded-xl bg-slate-900 p-8"
            >

              {item}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
