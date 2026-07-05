export default function FeaturedCourses() {
  const courses = [
    {
      title: "Financial Competency Foundations",
      level: "Beginner",
      description:
        "Build the habits and decision-making skills necessary for lifelong financial success.",
    },
    {
      title: "Real Estate (RED)",
      level: "Intermediate",
      description:
        "Residential, commercial, tax liens, tax deeds, creative financing, and 1031 exchanges.",
    },
    {
      title: "Paper Assets (WHITE)",
      level: "Intermediate",
      description:
        "Budgeting, credit, ETFs, stocks, options, retirement planning, and precious metals.",
    },
    {
      title: "Business (BLUE)",
      level: "Advanced",
      description:
        "KPIs, pricing, marketing, cash flow, profitability, leadership, and scaling.",
    },
  ];

  return (
    <section className="bg-[#08101f] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          FEATURED COURSES
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Start Learning Today
        </h2>

        <p className="mt-8 max-w-4xl text-2xl leading-10 text-slate-300">
          Structured education designed to transform financial literacy into
          measurable financial competency.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course.title}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-10"
            >
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">
                {course.level}
              </p>

              <h3 className="mt-4 text-3xl font-black">
                {course.title}
              </h3>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                {course.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
