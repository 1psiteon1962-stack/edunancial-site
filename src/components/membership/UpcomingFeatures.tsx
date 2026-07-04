export default function UpcomingFeatures() {
  const features = [
    "AI Business Coach",
    "AI Investment Coach",
    "Financial Passport",
    "Professional Marketplace",
    "Country-Specific Learning",
    "Corporate Dashboards",
    "Family Learning Plans",
    "Executive KPI Center",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">

        <h2 className="text-4xl font-bold">
          Coming Soon
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature}
              className="rounded-xl border border-slate-700 bg-slate-950/60 p-5"
            >
              {feature}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
