export default function DownloadLibrary() {
  const downloads = [
    "10 Rules to Build Wealth",
    "Budget Planner",
    "Cash Flow Worksheet",
    "Net Worth Worksheet",
    "Goal Planner",
    "Business KPI Worksheet",
    "Investment Tracker",
    "Financial Glossary",
    "Business Startup Checklist",
    "Monthly Financial Review",
    "Annual Financial Review",
    "Course Workbook",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Member Download Library
      </h2>

      <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {downloads.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6"
          >
            <h3 className="font-bold">
              {item}
            </h3>

            <button className="mt-6 rounded-lg bg-blue-600 px-4 py-2 font-semibold">
              Download
            </button>
          </div>
        ))}
      </div>

    </section>
  );
}
