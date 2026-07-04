export default function MembershipRoadmapGraphic() {
  const phases = [
    "Join",
    "Assess",
    "Learn",
    "Practice",
    "Measure",
    "Improve",
    "Certificate",
    "Lifetime Growth",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Membership Roadmap
      </h2>

      <div className="mt-16 grid gap-4 md:grid-cols-4 lg:grid-cols-8">

        {phases.map((phase) => (

          <div
            key={phase}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 text-center"
          >

            <div className="font-bold">
              {phase}
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}
