export default function MemberMilestones() {
  const milestones = [
    "First Login",
    "Assessment Completed",
    "First Course Completed",
    "Five Courses Completed",
    "First Certificate",
    "Financial Passport Created",
    "Marketplace Activated",
    "Business Track Completed",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Milestones
      </h2>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {milestones.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6"
          >
            ✓ {item}
          </div>
        ))}

      </div>

    </section>
  );
}
