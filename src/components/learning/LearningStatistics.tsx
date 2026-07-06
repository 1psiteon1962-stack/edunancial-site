export default function LearningStatistics() {

  const stats = [

    "10 Learning Paths",

    "100+ Courses",

    "50+ Case Studies",

    "25+ Business Tools",

    "20+ AI Advisors",

    "Decision Labs",

    "Competency Tracking",

    "Lifetime Certifications",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-8 md:grid-cols-4">

          {stats.map((item)=>(

            <div
              key={item}
              className="rounded-xl bg-slate-900 p-8 text-center text-xl font-bold"
            >

              {item}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
