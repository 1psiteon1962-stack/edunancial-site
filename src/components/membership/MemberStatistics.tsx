export default function MemberStatistics() {
  const stats = [
    "Courses Available",
    "Downloadable Resources",
    "Learning Paths",
    "Professional Categories",
    "Countries Planned",
    "AI Assistants",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Platform At A Glance
      </h2>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {stats.map((stat) => (

          <div
            key={stat}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-8 text-center"
          >

            <div className="text-5xl font-bold text-yellow-400">
              Coming Soon
            </div>

            <div className="mt-4 font-semibold">
              {stat}
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}
