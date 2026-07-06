export default function BusinessToolsPreview() {

  const tools = [

    "ROI Calculator",

    "Pricing Calculator",

    "Break-even Calculator",

    "Cash Flow Planner",

    "Business Health Score",

    "KPI Dashboard",

    "Startup Calculator",

    "Net Worth Calculator",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          BUSINESS TOOLS

        </p>

        <h2 className="mt-6 text-6xl font-black">

          Practical Tools

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {tools.map((tool)=>(

            <div
              key={tool}
              className="rounded-xl bg-slate-900 p-8"
            >

              {tool}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
