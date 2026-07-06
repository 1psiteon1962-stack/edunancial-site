export default function AIExecutiveBriefing() {

  const reports = [

    "Daily Executive Summary",

    "Financial Performance",

    "Treasury Position",

    "Operational KPIs",

    "Marketing Results",

    "Risk Alerts",

    "Growth Opportunities",

    "Recommended Actions",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          AI EXECUTIVE BRIEFING
        </p>

        <h2 className="mt-6 text-5xl font-black">

          Every Morning. One Briefing.

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {reports.map((report)=>(

            <div
              key={report}
              className="rounded-xl bg-slate-900 p-8"
            >

              {report}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
