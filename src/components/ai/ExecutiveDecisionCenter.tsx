export default function ExecutiveDecisionCenter() {

  const panels = [

    "CEO Dashboard",

    "CFO Dashboard",

    "Treasury",

    "Operations",

    "Marketing",

    "Risk",

    "AI Recommendations",

    "Executive Summary",

  ];

  return (

    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          EXECUTIVE DECISION CENTER
        </p>

        <h2 className="mt-6 text-5xl font-black">
          One Dashboard. Complete Visibility.
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {panels.map((panel)=>(

            <div key={panel} className="rounded-xl bg-slate-900 p-8">

              {panel}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
