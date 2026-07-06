export default function CompetencyCertification() {

  const certifications = [

    "Financial Literacy",

    "Financial Competency",

    "Startup Foundations",

    "Business Operations",

    "Profit Management",

    "Business Scaling",

    "Executive Leadership",

    "AI For Entrepreneurs",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          CERTIFICATIONS
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Earn Competency

        </h2>

        <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">

          Certificates are earned by demonstrating competency,
          not simply completing lessons.

        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {certifications.map((certification) => (

            <div
              key={certification}
              className="rounded-xl bg-slate-900 p-8"
            >

              {certification}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
