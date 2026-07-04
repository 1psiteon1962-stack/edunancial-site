export default function MemberRoadmap() {
  const steps = [
    "Create Your Account",
    "Complete Your Assessment",
    "Review Your Competency Score",
    "Receive Your Personalized Roadmap",
    "Complete Your First Course",
    "Download Your Resources",
    "Earn Your First Certificate",
    "Continue Building Financial Competency",
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-4xl font-bold">
        Your Membership Journey
      </h2>

      <div className="mt-16 space-y-6">
        {steps.map((step, index) => (
          <div
            key={step}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6"
          >
            <strong>Step {index + 1}</strong>

            <div className="mt-2">
              {step}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
