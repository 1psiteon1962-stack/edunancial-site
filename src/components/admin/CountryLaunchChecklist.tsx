export default function CountryLaunchChecklist() {

  const checklist = [

    "Legal Entity",

    "Bank Account",

    "Payment Provider",

    "Marketplace",

    "Membership",

    "Courses",

    "Localization",

    "Compliance Review",

    "AI Monitoring",

  ];

  return (

    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">

        Launch Checklist

      </h2>

      <div className="mt-8 space-y-4">

        {checklist.map(item => (

          <div
            key={item}
            className="flex items-center justify-between rounded-xl bg-slate-100 p-4"
          >

            <span>{item}</span>

            <span>⬜</span>

          </div>

        ))}

      </div>

    </section>

  );

}
