export default function WelcomeKit() {
  const items = [
    "Financial Competency Roadmap",
    "10 Rules to Build Wealth",
    "Personal Budget Worksheet",
    "Net Worth Worksheet",
    "Cash Flow Worksheet",
    "Goal Planning Worksheet",
    "Business KPI Starter Guide",
    "Investment Tracking Sheet",
    "Course Completion Planner",
    "Member Orientation Guide",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Welcome Kit
        </p>

        <h2 className="mt-4 text-4xl font-bold md:text-5xl">
          Everything You Receive Immediately
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          As soon as your membership becomes active you'll receive access to
          downloadable educational resources designed to help you begin your
          financial competency journey.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6"
          >
            ✓ {item}
          </div>
        ))}
      </div>
    </section>
  );
}
