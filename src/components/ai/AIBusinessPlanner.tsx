export default function AIBusinessPlanner() {

  const sections = [

    "Executive Summary",

    "Problem",

    "Solution",

    "Market",

    "Financial Projections",

    "Operations",

    "KPIs",

    "Growth Plan",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          AI BUSINESS PLANNER
        </p>

        <h2 className="mt-6 text-5xl font-black">

          Build Better Business Plans

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {sections.map((section)=>(

            <div
              key={section}
              className="rounded-xl bg-slate-900 p-8"
            >

              {section}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
