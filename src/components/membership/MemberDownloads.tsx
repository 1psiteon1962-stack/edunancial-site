export default function MemberDownloads() {

  const downloads = [

    "Budget Workbook",

    "Business KPI Workbook",

    "Investment Tracker",

    "Goal Planner",

    "Net Worth Worksheet",

    "Business Planning Workbook",

    "Retirement Planner",

    "Financial Competency Journal",

  ];

  return (

    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">

        Member Download Library

      </h2>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {downloads.map((item) => (

          <div
            key={item}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6"
          >

            <h3 className="font-semibold">
              {item}
            </h3>

          </div>

        ))}

      </div>

    </section>

  );

}
