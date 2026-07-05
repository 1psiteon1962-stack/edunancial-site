export default function MemberBenefits() {

  const benefits = [

    "Unlimited Learning",

    "Financial Competency Score",

    "Certificates",

    "Financial Passport",

    "Business KPI Tools",

    "Download Library",

    "AI Coach",

    "Global Marketplace",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          MEMBER BENEFITS
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Membership Has Advantages
        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {benefits.map((benefit) => (

            <div
              key={benefit}
              className="rounded-xl bg-slate-900 p-8 text-center"
            >

              {benefit}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
