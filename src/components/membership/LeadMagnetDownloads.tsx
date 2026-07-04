export default function LeadMagnetDownloads() {
  const downloads = [

    "10 Rules to Build Wealth",

    "Business KPI Checklist",

    "Personal Financial Checklist",

    "Budget Worksheet",

    "Cash Flow Worksheet",

    "Net Worth Worksheet",

    "Retirement Planning Checklist",

    "Entrepreneur Startup Checklist",

  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Free Downloads
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-center text-lg text-slate-300">
        Begin building financial competency today with these complimentary
        educational resources.
      </p>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {downloads.map((download) => (

          <div
            key={download}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6"
          >

            <h3 className="font-bold">
              {download}
            </h3>

            <button className="mt-6 rounded-lg bg-blue-600 px-4 py-2 font-semibold">
              Download Free
            </button>

          </div>

        ))}

      </div>

    </section>
  );
}
