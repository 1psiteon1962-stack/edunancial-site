export default function CourseNavigator() {

  const items = [

    "Current Course",

    "Completed Lessons",

    "Current Lesson",

    "Next Lesson",

    "Recommended Reading",

    "Practice Exercise",

    "Decision Lab",

    "Assessment",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          COURSE NAVIGATOR
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Always Know What's Next

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {items.map((item) => (

            <div
              key={item}
              className="rounded-xl bg-slate-900 p-8"
            >

              {item}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
