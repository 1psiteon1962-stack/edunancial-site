export default function CaseStudyTemplate() {

  const sections = [

    "Background",

    "Original Assumptions",

    "Business Model",

    "Problems Encountered",

    "Financial Numbers",

    "Decision Process",

    "Outcome",

    "Lessons Learned",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-5xl font-black">

          Every Case Study Includes

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {sections.map((section) => (

            <div
              key={section}
              className="rounded-xl bg-slate-900 p-8"
            >

              {section}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
