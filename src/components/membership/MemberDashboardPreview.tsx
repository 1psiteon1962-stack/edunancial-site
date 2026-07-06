export default function MemberDashboardPreview() {

  const widgets = [

    "Current Learning Path",

    "Competency Score",

    "Certificates",

    "AI Coach",

    "Case Studies",

    "Business Tools",

    "Progress",

    "Recommendations",

  ];

  return (

    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-6xl font-black">

          Your Dashboard

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {widgets.map((widget)=>(

            <div
              key={widget}
              className="rounded-xl bg-slate-900 p-8"
            >

              {widget}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
