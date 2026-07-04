export default function MemberDashboardFeatures() {
  const features = [
    "Financial Competency Score",
    "Assessment History",
    "Learning Progress",
    "Course Library",
    "Certificates",
    "Achievement Badges",
    "Download Center",
    "Financial Passport",
    "AI Recommendations",
    "Marketplace",
    "Saved Goals",
    "Member Profile",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Dashboard
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Everything In One Place
        </h2>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6"
          >
            {feature}
          </div>
        ))}
      </div>
    </section>
  );
}
