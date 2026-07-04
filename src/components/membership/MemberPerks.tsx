export default function MemberPerks() {
  const perks = [
    "Priority access to new courses",
    "Exclusive member downloads",
    "Future member discounts",
    "Marketplace promotions",
    "AI recommendations",
    "Business resource library",
    "Financial competency tracking",
    "Exclusive webinars",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Exclusive Member Perks
      </h2>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {perks.map((perk) => (
          <div
            key={perk}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6"
          >
            ✓ {perk}
          </div>
        ))}
      </div>

    </section>
  );
}
