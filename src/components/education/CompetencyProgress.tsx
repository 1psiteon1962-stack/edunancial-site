export default function CompetencyProgress() {

  const competencies = [

    "Budgeting",

    "Saving",

    "Debt Management",

    "Investing",

    "ROI Analysis",

    "Business Planning",

    "Cash Flow",

    "Decision Making",

    "AI Utilization",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-5xl font-black">

          Competency Progress

        </h2>

        <p className="mt-8 max-w-4xl text-xl text-slate-300">

          Progress is earned through demonstrated competency,
          not simply by completing lessons.

        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">

          {competencies.map((item) => (

            <div
              key={item}
              className="rounded-xl bg-slate-900 p-6"
            >

              □ {item}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
