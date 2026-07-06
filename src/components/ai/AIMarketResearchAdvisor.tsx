export default function AIMarketResearchAdvisor() {

  const topics = [

    "Market Size",

    "Industry Trends",

    "Competitor Analysis",

    "Customer Demographics",

    "Pricing Research",

    "SWOT Analysis",

    "Emerging Opportunities",

    "Risk Factors",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          AI MARKET RESEARCH
        </p>

        <h2 className="mt-6 text-5xl font-black">

          Understand Your Market

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {topics.map((topic)=>(

            <div
              key={topic}
              className="rounded-xl bg-slate-900 p-8"
            >

              {topic}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
