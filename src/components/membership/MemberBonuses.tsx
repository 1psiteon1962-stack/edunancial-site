export default function MemberBonuses() {
  const bonuses = [
    {
      title: "Free Starter Guides",
      description:
        "Download introductory guides covering budgeting, investing, entrepreneurship, real estate, and financial planning.",
    },
    {
      title: "Financial Calculators",
      description:
        "Use built-in calculators for ROI, cash flow, loan payments, savings growth, and investment projections.",
    },
    {
      title: "Business Templates",
      description:
        "Access business plan templates, KPI dashboards, pricing worksheets, profit calculators, and startup checklists.",
    },
    {
      title: "Member Webinars",
      description:
        "Attend exclusive educational webinars and live training sessions available only to active members.",
    },
    {
      title: "Early Access",
      description:
        "Be among the first to use new Edunancial courses, AI tools, assessments, dashboards, and marketplace features.",
    },
    {
      title: "Download Library",
      description:
        "Receive expanding collections of PDFs, worksheets, checklists, reference guides, and printable resources.",
    },
    {
      title: "Achievement Badges",
      description:
        "Earn digital badges as you complete courses, learning paths, and competency milestones.",
    },
    {
      title: "Lifetime Learning Record",
      description:
        "Maintain a permanent history of completed courses, certificates, competency scores, and achievements.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Member Bonuses
        </p>

        <h2 className="mt-4 text-4xl font-bold md:text-5xl">
          More Than Courses
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Membership includes an expanding collection of educational tools,
          downloadable resources, business templates, calculators, and future
          platform upgrades designed to help you continuously improve your
          financial competency.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {bonuses.map((bonus) => (
          <div
            key={bonus.title}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 transition hover:border-yellow-400"
          >
            <h3 className="text-lg font-bold text-white">
              {bonus.title}
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              {bonus.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
