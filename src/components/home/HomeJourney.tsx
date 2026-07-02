import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Learn",
    description:
      "Build financial literacy through structured courses organized by RED, WHITE, and BLUE.",
  },
  {
    number: "02",
    title: "Assess",
    description:
      "Measure your current financial and business competency with personalized assessments.",
  },
  {
    number: "03",
    title: "Practice",
    description:
      "Complete missions, simulations, and real-world exercises that build experience.",
  },
  {
    number: "04",
    title: "Achieve",
    description:
      "Earn certificates, improve your Passport, and continue advancing your competency.",
  },
];

export default function HomeJourney() {
  return (
    <section className="py-24 bg-[#08101f]">

      <div className="mx-auto max-w-7xl px-6">

        <p className="uppercase tracking-[0.4em] font-bold text-yellow-400">
          YOUR JOURNEY
        </p>

        <h2 className="mt-6 text-6xl font-black text-white">
          Learn.
          <br />
          Practice.
          <br />
          Improve.
        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {steps.map((step) => (

            <div
              key={step.number}
              className="rounded-xl bg-slate-900 p-8"
            >

              <p className="text-5xl font-black text-blue-500">
                {step.number}
              </p>

              <h3 className="mt-5 text-3xl font-black">
                {step.title}
              </h3>

              <p className="mt-6 text-xl leading-9 text-slate-300">
                {step.description}
              </p>

            </div>

          ))}

        </div>

        <div className="mt-16">

          <Link
            href="/roadmap"
            className="rounded-xl bg-green-600 px-8 py-5 text-xl font-bold hover:bg-green-700"
          >
            View Learning Roadmap
          </Link>

        </div>

      </div>

    </section>
  );
}
