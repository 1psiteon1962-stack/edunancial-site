export default function CorporateMembership() {
  const benefits = [
    "Employee financial competency training",
    "Management reporting dashboard",
    "Group memberships",
    "Progress reporting",
    "Business KPI education",
    "Customized learning paths",
    "Priority support",
    "Future enterprise AI coaching",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10">

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Corporate Membership
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Invest In Your Team
        </h2>

        <p className="mt-6 max-w-3xl leading-8 text-slate-300">
          Organizations can improve employee financial competency while
          providing structured learning, measurable progress, and future
          business analytics.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="rounded-xl border border-slate-700 bg-slate-950/60 p-5"
            >
              ✓ {benefit}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
