import Link from "next/link";

export const metadata = {
  title: "Financial Competency Assessment | Edunancial",
  description:
    "Begin your Financial Competency Assessment.",
};

export default function AssessmentStartPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          FINANCIAL COMPETENCY ASSESSMENT

        </p>

        <h1 className="mt-8 text-7xl font-black">

          Begin Your
          <br />
          Financial Journey

        </h1>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

          This assessment measures your current Financial Competency
          across six major areas.

          At the end, you'll receive your Financial Competency Score,
          personalized recommendations,
          and a customized learning roadmap.

        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2">

          <div className="rounded-2xl bg-slate-900 p-10">

            <h2 className="text-3xl font-black">

              Assessment Includes

            </h2>

            <ul className="mt-8 space-y-4 text-xl text-slate-300">

              <li>• Personal Financial Management</li>

              <li>• Investing & Paper Assets</li>

              <li>• Real Estate</li>

              <li>• Business</li>

              <li>• Risk Management</li>

              <li>• Financial Competency Profile</li>

            </ul>

          </div>

          <div className="rounded-2xl bg-slate-900 p-10">

            <h2 className="text-3xl font-black">

              Before You Begin

            </h2>

            <p className="mt-8 text-xl leading-9 text-slate-300">

              Answer every question honestly.

              There are no penalties for lower scores.

              The purpose is to identify your current level of
              Financial Competency so Edunancial can recommend
              the most effective learning path.

            </p>

          </div>

        </div>

        <div className="mt-12">

                   <div className="rounded-2xl border border-blue-600 bg-[#111827] p-10">

            <h2 className="text-3xl font-black">

              What You'll Receive

            </h2>

            <div className="mt-8 space-y-6">

              <div>

                <h3 className="text-2xl font-bold">

                  Financial Competency Score

                </h3>

                <p className="mt-2 text-slate-300">

                  An overall score measuring your current level of
                  financial competency.

                </p>

              </div>

              <div>

                <h3 className="text-2xl font-bold">

                  Category Scores

                </h3>

                <p className="mt-2 text-slate-300">

                  Individual scores for Personal Finance,
                  Investing,
                  Real Estate,
                  Business,
                  Risk Management,
                  and your overall Financial Profile.

                </p>

              </div>

              <div>

                <h3 className="text-2xl font-bold">

                  Personalized Learning Roadmap

                </h3>

                <p className="mt-2 text-slate-300">

                  A customized sequence of recommended courses
                  designed to improve your weakest areas first.

                </p>

              </div>

              <div>

                <h3 className="text-2xl font-bold">

                  Progress Tracking

                </h3>

                <p className="mt-2 text-slate-300">

                  Your results become part of your Financial
                  Competency Passport so you can measure your
                  improvement over time.

                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="mt-16 flex justify-between">

          <Link
            href="/assessment"
            className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-black"
          >

            Back

          </Link>

          <Link
            href="/assessment/start/section-1"
            className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700"
          >

            Begin Assessment →

          </Link>

        </div>

              </section>

    </main>

  );
}
