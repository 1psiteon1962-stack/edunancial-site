export default function MemberSupport() {

  const options = [

    "Knowledge Base",

    "Frequently Asked Questions",

    "AI Member Assistant",

    "Technical Support",

    "Billing Support",

    "Course Assistance",

    "Marketplace Support",

    "Account Management",

  ];

  return (

    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">

        Member Support

      </h2>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {options.map((option) => (

          <div
            key={option}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 text-center"
          >

            {option}

          </div>

        ))}

      </div>

    </section>

  );

}
