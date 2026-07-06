export default function CertificationRoadmap() {

  const certifications = [

    "Foundations",

    "Financial Literacy",

    "Financial Competency",

    "Startup Foundations",

    "Business Operations",

    "Business Scaling",

    "Executive Leadership",

    "Wealth Builder",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-5xl font-black">

          Certification Roadmap

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {certifications.map((item)=>(

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
