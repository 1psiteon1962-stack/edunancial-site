export default function BusinessRealitySeries() {

  const lessons = [

    "Revenue Is Not Profit",

    "Growth Can Destroy A Business",

    "Customers Do Not Owe You Sales",

    "Cash Flow Determines Survival",

    "Hope Must Be Supported By Numbers",

    "Pivoting Is Not Failure",

    "Reality Always Wins",

    "Know Your Numbers",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          BUSINESS REALITY
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Business Truths Every Entrepreneur Learns

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {lessons.map((lesson) => (

            <div
              key={lesson}
              className="rounded-xl bg-slate-900 p-8"
            >

              {lesson}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
