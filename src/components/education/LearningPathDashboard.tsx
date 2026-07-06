export default function LearningPathDashboard() {

  const paths = [

    "Foundations",

    "Financial Literacy",

    "Financial Competency",

    "Entrepreneurship",

    "Business Operations",

    "Business Scaling",

    "Executive Leadership",

    "AI for Business",

    "Wealth Building",

  ];

  return (

    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          LEARNING DASHBOARD
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Your Learning Journey

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          {paths.map((path, index) => (

            <div
              key={path}
              className="rounded-xl bg-slate-900 p-8"
            >

              <p className="font-bold text-yellow-400">

                Path {index + 1}

              </p>

              <h3 className="mt-4 text-2xl font-black">

                {path}

              </h3>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
