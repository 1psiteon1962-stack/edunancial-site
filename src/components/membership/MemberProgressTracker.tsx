export default function MemberProgressTracker() {

  const items = [
    "Courses Completed",
    "Certificates Earned",
    "Assessment Score",
    "Current Competency Level",
    "Learning Streak",
    "Next Recommended Course",
  ];

  return (

    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Track Your Progress
      </h2>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">

        {items.map((item) => (

          <div
            key={item}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-8"
          >

            <h3 className="font-semibold">
              {item}
            </h3>

            <p className="mt-4 text-slate-400">
              Available inside your member dashboard.
            </p>

          </div>

        ))}

      </div>

    </section>

  );

}
