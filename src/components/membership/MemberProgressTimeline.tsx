export default function MemberProgressTimeline() {
  const timeline = [
    "Register",
    "Assessment",
    "Learning Path",
    "First Course",
    "Certificate",
    "Marketplace",
    "Financial Passport",
    "Lifetime Learning",
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Your Progress Timeline
      </h2>

      <div className="mt-16 space-y-5">
        {timeline.map((item, index) => (
          <div
            key={item}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6"
          >
            <strong>Stage {index + 1}</strong>

            <div className="mt-2">
              {item}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
