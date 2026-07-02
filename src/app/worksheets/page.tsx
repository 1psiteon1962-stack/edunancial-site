export const metadata = {
  title: "Worksheets | Edunancial",
};

const worksheets = [
  "Monthly Budget",
  "Net Worth",
  "Debt Reduction",
  "Business KPI",
  "Cash Flow",
  "Investment Planner",
  "Goal Planner",
  "Retirement Planner",
];

export default function WorksheetsPage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">

          WORKSHEETS

        </p>

        <h1 className="mt-6 text-6xl font-black">

          Practice What You Learn

        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {worksheets.map((sheet) => (

            <div
              key={sheet}
              className="rounded-xl bg-slate-900 p-8 flex items-center justify-between"
            >

              <h2 className="text-2xl font-black">

                {sheet}

              </h2>

              <button className="rounded-lg bg-green-600 px-5 py-3 font-bold">

                Download

              </button>

            </div>

          ))}

        </div>

      </section>

    </main>

  );

}
