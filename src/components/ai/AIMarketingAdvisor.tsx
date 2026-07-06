export default function AIMarketingAdvisor() {

  const metrics = [

    "Campaign ROI",

    "Brand Awareness",

    "SEO",

    "Social Media",

    "Email Marketing",

    "Paid Advertising",

    "Content Strategy",

    "Marketing KPIs",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          AI MARKETING ADVISOR

        </p>

        <h2 className="mt-6 text-5xl font-black">

          Data-Driven Marketing

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {metrics.map((metric)=>(

            <div key={metric} className="rounded-xl bg-slate-900 p-8">

              {metric}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
