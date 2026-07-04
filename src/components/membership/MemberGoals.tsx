export default function MemberGoals() {
  const goals = [
    "Build Emergency Fund",
    "Reduce Debt",
    "Improve Credit",
    "Purchase Home",
    "Start Investing",
    "Start Business",
    "Increase Income",
    "Plan Retirement",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <div className="text-center">

        <h2 className="text-4xl font-bold">
          Set Financial Goals
        </h2>

      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {goals.map((goal) => (
          <div
            key={goal}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6"
          >
            {goal}
          </div>
        ))}

      </div>

    </section>
  );
}
