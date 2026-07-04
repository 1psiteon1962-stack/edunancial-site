export default function MemberBadges() {
  const badges = [
    "Financial Foundations",
    "Budget Master",
    "Credit Builder",
    "Investor",
    "Entrepreneur",
    "Business Leader",
    "Global Investor",
    "Financial Competency",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <div className="text-center">

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Digital Achievements
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Earn Achievement Badges
        </h2>

      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {badges.map((badge) => (

          <div
            key={badge}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-8 text-center"
          >

            <div className="text-5xl">🏆</div>

            <h3 className="mt-5 font-semibold">
              {badge}
            </h3>

          </div>

        ))}

      </div>

    </section>
  );
}
