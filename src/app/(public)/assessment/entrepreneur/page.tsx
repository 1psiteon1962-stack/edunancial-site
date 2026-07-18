export const metadata = {
  title: "Entrepreneur Assessment | Edunancial",
};

const questions = [
  "How many businesses have you started?",
  "How many years have you owned a business?",
  "What keeps you awake at night?",
  "Revenue",
  "Profit",
  "Cash Flow",
  "Hiring",
  "Marketing",
  "Distribution",
  "Value Chain",
  "Taxes",
  "KPIs",
];

export default function EntrepreneurAssessmentPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <h1 className="text-6xl font-black">

          Entrepreneur Assessment

        </h1>

        <p className="mt-8 text-2xl text-slate-300">

          Discover your current business competency and receive a personalized roadmap.

        </p>

        <div className="mt-16 space-y-6">

          {questions.map((q)=>(

            <div
              key={q}
              className="rounded-xl bg-slate-900 p-6"
            >

              {q}

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}
