export default function FreeDownloadsSection() {
  const downloads = [
    "Financial Competency Checklist",
    "Personal Budget Worksheet",
    "Business KPI Starter Pack",
    "Goal Planning Workbook",
    "Net Worth Calculator",
    "Recommended Reading Guide",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Free Resources
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Every Member Starts With Free Tools
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {downloads.map((item) => (

            <div
              key={item}
              className="rounded-xl border border-slate-700 bg-slate-800/50 p-6"
            >
              <h3 className="font-semibold">
                {item}
              </h3>

              <p className="mt-4 text-slate-300">
                Included with Free Membership.
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
