export default function StartupToolkit() {
  const tools = [
    "Startup Cost Calculator",
    "Break-even Calculator",
    "ROI Calculator",
    "Pricing Calculator",
    "Cash Flow Planner",
    "Business Health Score",
    "KPI Dashboard",
    "Business Plan Builder",
  ];

  return (
    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          STARTUP TOOLKIT
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Practical Business Tools
        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {tools.map((tool) => (
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
