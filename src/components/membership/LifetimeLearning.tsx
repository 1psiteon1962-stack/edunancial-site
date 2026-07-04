export default function LifetimeLearning() {

  const topics = [

    "Children",

    "Teenagers",

    "Young Adults",

    "Families",

    "Entrepreneurs",

    "Professionals",

    "Business Owners",

    "Retirement",

  ];

  return (

    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">

        Learning For Every Stage Of Life

      </h2>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {topics.map((topic) => (

          <div
            key={topic}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-8 text-center"
          >

            {topic}

          </div>

        ))}

      </div>

    </section>

  );

}
