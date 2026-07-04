export const metadata = {
  title: "Downloads | Edunancial",
};

export default function DownloadsPage() {

  const downloads = [

    "Budget Workbook",

    "Financial Goal Planner",

    "Business KPI Workbook",

    "Investment Tracker",

    "Cash Flow Worksheet",

    "Net Worth Worksheet",

    "Financial Competency Journal",

    "Course Companion Guides",

  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">

      <h1 className="text-4xl font-bold">
        Member Downloads
      </h1>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {downloads.map((download) => (

          <div
            key={download}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6"
          >

            <h3 className="font-semibold">
              {download}
            </h3>

          </div>

        ))}

      </div>

    </main>
  );
}
