export default function LearningPathPreview() {
  const paths = [
    "Personal Finance",
    "Budgeting",
    "Debt Reduction",
    "Investing",
    "Real Estate",
    "Business",
    "Retirement",
    "Financial Leadership",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Learning Paths
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Follow Your Personalized Roadmap
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Your assessment will recommend the most appropriate learning path
          based upon your current level of financial competency.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {paths.map((path) => (
          <div
            key={path}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 text-center"
          >
            <h3 className="font-bold">
              {path}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
