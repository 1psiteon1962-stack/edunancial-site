export const metadata = {
  title: "AI Financial Coach | Edunancial",
};

const features = [
  "Personal Financial Coach",
  "Business Coach",
  "Investment Guidance",
  "Course Recommendations",
  "Book Recommendations",
  "Goal Tracking",
  "Competency Analysis",
  "24/7 AI Assistance",
];

export default function AICoachPage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          AI FINANCIAL COACH
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Learn Smarter.
          <br />
          Grow Faster.
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {features.map((feature) => (

            <div
              key={feature}
              className="rounded-xl bg-slate-900 p-8"
            >

              <h2 className="text-2xl font-black">
                {feature}
              </h2>

            </div>

          ))}

        </div>

      </section>

    </main>

  );

}
