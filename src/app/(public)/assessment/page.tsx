import Link from "next/link";

export const metadata = {
  title: "Financial Intelligence Assessment | Edunancial",
  description:
    "Discover your financial strengths, wealth-building opportunities, and personalized Edunancial learning path.",
};

export default function AssessmentPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          EDUNANCIAL FINANCIAL INTELLIGENCE ASSESSMENT
        </p>

        <h1 className="mt-8 text-7xl font-black">
          Find Your Starting Point.
          <br />
          Build Your Path to Ownership.
        </h1>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          Financial literacy teaches concepts. Financial intelligence helps you decide how to use them.
        </p>

        <p className="mt-8 max-w-5xl text-xl leading-9 text-slate-400">
          This free diagnostic is not a pass/fail test. It identifies your current strengths and opportunities across personal finance, investing, real estate, business ownership, and risk management, then recommends where to begin learning.
        </p>

        <div className="mt-20 rounded-2xl bg-slate-900 p-10">
          <h2 className="text-4xl font-black">What You Receive</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div>✓ Financial Intelligence Starting Point</div>
            <div>✓ Strongest Financial Competencies</div>
            <div>✓ Greatest Wealth-Building Opportunities</div>
            <div>✓ Real Estate Readiness (RED)</div>
            <div>✓ Paper Assets & Investing Readiness (WHITE)</div>
            <div>✓ Business Ownership Readiness (BLUE)</div>
            <div>✓ Risk & Financial Defense Profile</div>
            <div>✓ Personalized Learning Roadmap</div>
            <div>✓ Recommended Edunancial Starting Areas</div>
            <div>✓ A Baseline You Can Improve Over Time</div>
          </div>
        </div>

        <div className="mt-20 rounded-2xl border border-slate-700 p-10">
          <h2 className="text-4xl font-black">Before You Begin</h2>
          <ul className="mt-8 space-y-4 text-xl leading-9 text-slate-300">
            <li>• Estimated completion time: 15–20 minutes.</li>
            <li>• This is a diagnostic, not a pass/fail examination.</li>
            <li>• Answer honestly so your recommendations reflect your actual starting point.</li>
            <li>• Your results identify strengths, opportunities, and a recommended learning path.</li>
            <li>• Retake it later to compare your progress as your financial intelligence develops.</li>
          </ul>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <Link href="/assessment/start" className="rounded-xl bg-blue-600 p-8 text-center hover:bg-blue-700">
            <h2 className="text-3xl font-black">Start Free Diagnostic</h2>
            <p className="mt-5 text-slate-200">Discover where you are today and what to learn next.</p>
          </Link>
          <Link href="/assessment/how-it-works" className="rounded-xl border border-white p-8 text-center hover:bg-white hover:text-black">
            <h2 className="text-3xl font-black">How It Works</h2>
            <p className="mt-5">See how Edunancial turns your answers into a learning roadmap.</p>
          </Link>
          <Link href="/assessment/sample-report" className="rounded-xl border border-green-500 p-8 text-center hover:bg-green-600">
            <h2 className="text-3xl font-black">Sample Report</h2>
            <p className="mt-5">Preview the strengths, opportunities, and recommendations you receive.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
