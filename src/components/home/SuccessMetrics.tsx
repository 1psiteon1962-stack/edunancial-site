export default function SuccessMetrics() {

  const metrics = [

    "Lessons Completed",

    "Competencies Earned",

    "Decision Labs Passed",

    "Case Studies Completed",

    "Business Plans Created",

    "ROI Calculated",

    "AI Sessions",

    "Certifications Earned",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          SUCCESS METRICS

        </p>

        <h2 className="mt-6 text-6xl font-black">

          Measure Your Progress

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {metrics.map((metric)=>(

            <div
              key={metric}
              className="rounded-xl bg-slate-900 p-8"
            >

              {metric}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
