export default function ExecutiveAITeam() {

  const agents = [

    {
      title: "AI CEO",
      description:
        "Coordinates executive decisions, strategic priorities, growth opportunities, and business planning.",
    },

    {
      title: "AI CFO",
      description:
        "Analyzes profitability, cash flow, financial statements, forecasting, capital allocation and overall financial performance.",
    },

    {
      title: "AI Treasury Officer",
      description:
        "Optimizes global cash management across currencies, monitors exchange rates, evaluates currency exposure, forecasts liquidity needs, and recommends treasury strategies.",
    },

    {
      title: "AI Controller",
      description:
        "Monitors accounting accuracy, reconciliations, internal controls, reporting consistency and audit readiness.",
    },

    {
      title: "AI Tax Advisor",
      description:
        "Monitors tax obligations across jurisdictions, identifies planning opportunities, and coordinates international tax considerations.",
    },

    {
      title: "AI Compliance Officer",
      description:
        "Tracks regulatory requirements, reporting deadlines, licensing obligations and corporate compliance.",
    },

    {
      title: "AI Operations Officer",
      description:
        "Measures operational KPIs, productivity, staffing efficiency, inventory management and process improvement.",
    },

    {
      title: "AI Growth Advisor",
      description:
        "Identifies expansion opportunities, market trends, customer acquisition strategies and scaling priorities.",
    }

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          EXECUTIVE AI TEAM

        </p>

        <h2 className="mt-6 text-6xl font-black">

          Your Executive AI Team

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {agents.map((agent) => (

            <div
              key={agent.title}
              className="rounded-xl bg-slate-900 p-8"
            >

              <h3 className="text-3xl font-black">

                {agent.title}

              </h3>

              <p className="mt-6 text-slate-300">

                {agent.description}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
