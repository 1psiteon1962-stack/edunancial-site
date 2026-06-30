export default function DownloadsLibrary() {

  const downloads = [
    "Budget Worksheet",
    "Business KPI Tracker",
    "Net Worth Calculator",
    "Investment Checklist",
    "Business Startup Guide",
    "Financial Goal Planner"
  ];

  return (

    <section className="py-24 bg-[#111827]">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-5xl font-black">
          Free Downloads
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">

          {downloads.map((item) => (

            <div
              key={item}
              className="rounded-xl border border-slate-700 p-6"
            >

              <h3 className="text-2xl font-bold">
                {item}
              </h3>

              <button className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-bold">
                Download
              </button>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
