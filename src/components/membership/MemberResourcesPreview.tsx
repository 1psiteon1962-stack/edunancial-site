export default function MemberResourcesPreview() {
  const resources = [
    "Books",
    "Courses",
    "Worksheets",
    "Calculators",
    "Templates",
    "Videos",
    "AI Tools",
    "Reference Guides",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Everything You Need In One Place
      </h2>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {resources.map((resource) => (

          <div
            key={resource}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-8 text-center"
          >

            {resource}

          </div>

        ))}

      </div>

    </section>
  );
}
