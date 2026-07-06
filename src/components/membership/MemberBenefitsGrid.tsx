export default function MemberBenefitsGrid() {

  const benefits = [

    "Learning Paths",

    "Business Calculators",

    "Decision Labs",

    "Case Studies",

    "AI Executive Team",

    "Financial Passport",

    "Competency Tracking",

    "Certificates",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-6xl font-black">

          Member Benefits

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {benefits.map((benefit)=>(

            <div
              key={benefit}
              className="rounded-xl bg-slate-900 p-8"
            >

              {benefit}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
