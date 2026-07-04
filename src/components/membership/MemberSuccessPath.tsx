export default function MemberSuccessPath() {

  const steps = [
    "Join",
    "Assess",
    "Learn",
    "Practice",
    "Measure",
    "Improve",
    "Earn Certificates",
    "Continue Growing",
  ];

  return (

    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Your Success Path
      </h2>

      <div className="mt-14 grid gap-4 md:grid-cols-4 lg:grid-cols-8">

        {steps.map((step) => (

          <div
            key={step}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 text-center"
          >
            {step}
          </div>

        ))}

      </div>

    </section>

  );

}
