export default function CertificationPrograms() {

  const programs = [

    "Financial Competency",

    "Business Fundamentals",

    "Real Estate",

    "Paper Assets",

    "Entrepreneurship",

    "Artificial Intelligence",

    "Executive Leadership",

    "Global Business",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          CERTIFICATIONS
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Earn Professional Recognition

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {programs.map((program) => (

            <div
              key={program}
              className="rounded-xl bg-slate-900 p-8"
            >

              {program}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
