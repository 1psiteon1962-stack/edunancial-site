export default function MemberResources() {
  const resources = [
    "Books",
    "Courses",
    "Calculators",
    "Worksheets",
    "Templates",
    "Case Studies",
    "Business Forms",
    "Investment Resources",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Member Resource Center
      </h2>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {resources.map((resource) => (
          <div
            key={resource}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6"
          >
            {resource}
          </div>
        ))}
      </div>

    </section>
  );
}
