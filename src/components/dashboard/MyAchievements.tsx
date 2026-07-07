const badges = [
  "First Login",
  "Assessment Complete",
  "Financial Literacy I",
  "Business Foundations",
  "ROI Fundamentals",
  "AI Explorer",
];

export default function MyAchievements() {
  return (
    <section className="rounded-2xl bg-slate-900 p-10">
      <h2 className="text-3xl font-black">
        Achievements
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {badges.map((badge) => (
          <div
            key={badge}
            className="rounded-xl border border-slate-700 p-5"
          >
            🏆 {badge}
          </div>
        ))}
      </div>
    </section>
  );
}
