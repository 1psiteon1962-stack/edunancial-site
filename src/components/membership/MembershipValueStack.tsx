export default function MembershipValueStack() {
  const values = [
    {
      label: "Financial Competency Assessment",
      value: "$29 value",
    },
    {
      label: "Starter Learning Roadmap",
      value: "Included",
    },
    {
      label: "Downloadable Guides",
      value: "Included",
    },
    {
      label: "Worksheets and Calculators",
      value: "Included",
    },
    {
      label: "Course Access",
      value: "Included by plan",
    },
    {
      label: "Financial Passport Tracking",
      value: "Included",
    },
    {
      label: "Marketplace Access",
      value: "Included by plan",
    },
    {
      label: "AI Coach Access",
      value: "Included by plan",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Value Stack
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          What Your Membership Unlocks
        </h2>

        <p className="mt-6 max-w-3xl leading-8 text-slate-300">
          Membership combines assessment, education, downloads, tracking,
          marketplace access, and future AI tools into one financial competency
          system.
        </p>

        <div className="mt-10 divide-y divide-slate-700">
          {values.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-6 py-5"
            >
              <span className="font-semibold text-white">
                {item.label}
              </span>

              <span className="text-slate-300">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
