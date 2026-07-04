export default function MemberCourseLibrary() {

  const categories = [

    "RED - Real Estate",

    "WHITE - Paper Assets",

    "BLUE - Business",

    "Financial Competency",

    "Leadership",

    "Entrepreneurship",

    "Artificial Intelligence",

    "Global Business",

  ];

  return (

    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">

        Member Course Library

      </h2>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {categories.map((category) => (

          <div
            key={category}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-8 text-center"
          >

            <h3 className="font-semibold">

              {category}

            </h3>

          </div>

        ))}

      </div>

    </section>

  );

}
