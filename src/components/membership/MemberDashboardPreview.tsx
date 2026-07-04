export default function MemberDashboardPreview() {
  const cards = [
    {
      title: "Financial Competency Score",
      value: "Coming Soon",
    },
    {
      title: "Courses Completed",
      value: "0",
    },
    {
      title: "Certificates Earned",
      value: "0",
    },
    {
      title: "Downloads Available",
      value: "12+",
    },
    {
      title: "Marketplace Access",
      value: "Active",
    },
    {
      title: "AI Coach",
      value: "Ready",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Member Dashboard
        </p>

        <h2 className="mt-4 text-4xl font-bold md:text-5xl">
          Your Personal Command Center
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Monitor your learning, financial competency, certificates,
          downloads, marketplace access, and AI recommendations from one
          personalized dashboard.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 p-8"
          >
            <h3 className="text-xl font-bold">
              {card.title}
            </h3>

            <p className="mt-6 text-3xl font-bold text-yellow-400">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
