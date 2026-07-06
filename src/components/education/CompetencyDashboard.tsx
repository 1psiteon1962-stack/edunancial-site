export default function CompetencyDashboard() {

  const skills = [

    "Budgeting",

    "Credit",

    "Cash Flow",

    "ROI",

    "Pricing",

    "Profit Analysis",

    "Business Planning",

    "Leadership",

    "AI Utilization",

    "Investment Analysis",

    "Decision Making",

    "Risk Assessment",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          COMPETENCY DASHBOARD
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Demonstrated Competency

        </h2>

        <div className="mt-20 grid gap-6 md:grid-cols-3 lg:grid-cols-4">

          {skills.map((skill) => (

            <div
              key={skill}
              className="rounded-xl bg-slate-900 p-6"
            >

              □ {skill}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
