export default function MemberAchievements() {
  const achievements = [
    "First Course Completed",
    "Financial Competency Assessment",
    "First Certificate Earned",
    "Five Courses Completed",
    "Business Fundamentals",
    "Real Estate Fundamentals",
    "Investment Fundamentals",
    "Financial Competency Milestone",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Achievements
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Celebrate Your Progress
        </h2>

      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {achievements.map((achievement) => (
          <div
            key={achievement}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 text-center"
          >
            🏆
            <h3 className="mt-4 font-bold">
              {achievement}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
