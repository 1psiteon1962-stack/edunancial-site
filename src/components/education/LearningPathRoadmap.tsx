export default function LearningPathRoadmap() {

  const roadmap = [

    "Foundations",

    "Financial Literacy",

    "Financial Competency",

    "Entrepreneurship",

    "Business Operations",

    "Business Scaling",

    "Executive Leadership",

    "AI For Business",

    "Wealth Building",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-5xl font-black">

          Your Complete Roadmap

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          {roadmap.map((step, index) => (

            <div
              key={step}
              className="rounded-xl bg-slate-900 p-8"
            >

              <div className="text-yellow-400 font-bold">

                Stage {index + 1}

              </div>

              <h3 className="mt-4 text-3xl font-black">

                {step}

              </h3>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
