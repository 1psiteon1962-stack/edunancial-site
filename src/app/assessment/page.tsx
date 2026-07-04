import Link from "next/link";

export const metadata = {
  title: "Financial Competency Assessment | Edunancial",
  description:
    "Measure your financial competency and receive a personalized learning roadmap.",
};

export default function AssessmentPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          EDUNANCIAL ASSESSMENT
        </p>

        <h1 className="mt-8 text-7xl font-black">
          Discover Your
          <br />
          Financial Competency
        </h1>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          Financial literacy provides the foundation.
          <br />
          Financial competency is built through disciplined action.
        </p>

        <p className="mt-8 max-w-5xl text-xl leading-9 text-slate-400">
          This assessment evaluates how prepared you are to make
          real-world financial decisions and provides a personalized
          roadmap for continuous improvement.
        </p>

        <div className="mt-20 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Your Assessment Includes

          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">

            <div>✓ Overall Financial Competency Score</div>

            <div>✓ Personal Financial Management</div>

            <div>✓ Real Estate Competency (RED)</div>

            <div>✓ Paper Assets Competency (WHITE)</div>

            <div>✓ Business Competency (BLUE)</div>

            <div>✓ Entrepreneur Readiness</div>

            <div>✓ Investor Readiness</div>

            <div>✓ Risk Management Profile</div>

            <div>✓ Personalized Learning Roadmap</div>

            <div>✓ Course Recommendations</div>

            <div>✓ Progress Tracking</div>

            <div>✓ Retake Anytime</div>

          </div>

        </div>

        <div className="mt-20 rounded-2xl border border-slate-700 p-10">

          <h2 className="text-4xl font-black">

            Before You Begin

          </h2>

          <ul className="mt-8 space-y-4 text-xl leading-9 text-slate-300">

            <li>• Estimated completion time: 15–20 minutes</li>

            <li>• There are no trick questions.</li>

            <li>• Answer honestly for the most accurate results.</li>

            <li>• Your results generate a customized learning roadmap.</li>

            <li>• You can retake the assessment as your competency improves.</li>

          </ul>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          <Link
            href="/assessment/start"
            className="rounded-xl bg-blue-600 p-8 text-center hover:bg-blue-700"
          >

            <h2 className="text-3xl font-black">

              Start Assessment

            </h2>

            <p className="mt-5 text-slate-200">

              Begin your Financial Competency Assessment.

            </p>

          </Link>

          <Link
            href="/assessment/how-it-works"
            className="rounded-xl border border-white p-8 text-center hover:bg-white hover:text-black"
          >

            <h2 className="text-3xl font-black">

              How It Works

            </h2>

            <p className="mt-5">

              Learn how your competency is measured.

            </p>

          </Link>

          <Link
            href="/assessment/sample-report"
            className="rounded-xl border border-green-500 p-8 text-center hover:bg-green-600"
          >

            <h2 className="text-3xl font-black">

              Sample Report

            </h2>

            <p className="mt-5">

              Preview your personalized assessment report.

            </p>

          </Link>

        </div>

      </section>

    </main>
  );
}
