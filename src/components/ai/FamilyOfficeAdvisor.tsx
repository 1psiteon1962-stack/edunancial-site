export default function FamilyOfficeAdvisor() {

  const services = [

    "Asset Allocation",

    "Tax Coordination",

    "Estate Planning",

    "Philanthropy",

    "Trust Administration",

    "Family Governance",

    "Succession Planning",

    "Legacy Management",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          AI FAMILY OFFICE
        </p>

        <h2 className="mt-6 text-5xl font-black">
          Protect Multi-Generational Wealth
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {services.map((service)=>(

            <div key={service} className="rounded-xl bg-slate-900 p-8">

              {service}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
