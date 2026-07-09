import Link from "next/link";

export const metadata = {
  title: "How the Assessment Works | Edunancial",
  description:
    "Learn how the Edunancial Financial Competency Assessment measures your financial knowledge and skills.",
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          HOW IT WORKS
        </p>

        <h1 className="mt-8 text-7xl font-black">
          How We Measure
          <br />
          Financial Competency
        </h1>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          Financial literacy provides the foundation. Financial competency
          is built through disciplined action. The Edunancial Assessment
          measures where you are today and shows you the fastest path forward.
        </p>

        {/* The Framework */}
        <div className="mt-20 rounded-2xl bg-slate-900 p-10">
          <h2 className="text-4xl font-black">The Competency Framework</h2>
          <p className="mt-6 text-xl leading-9 text-slate-300">
            The Edunancial Financial Competency Assessment is structured around
            six core areas of financial mastery. Each area reflects a distinct
            dimension of real-world financial decision making.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "01",
                title: "Personal Financial Management",
                desc: "Budgeting, savings, cash flow, debt management, and financial planning.",
              },
              {
                label: "02",
                title: "Investing & Paper Assets",
                desc: "Stocks, ETFs, precious metals, retirement planning, and portfolio construction.",
              },
              {
                label: "03",
                title: "Real Estate",
                desc: "Residential investing, commercial property, creative financing, and 1031 exchanges.",
              },
              {
                label: "04",
                title: "Business Competency",
                desc: "Entrepreneurship, profit, pricing, KPIs, leadership, and scaling.",
              },
              {
                label: "05",
                title: "Risk Management",
                desc: "Emergency funds, insurance, asset protection, and diversification.",
              },
              {
                label: "06",
                title: "Financial Profile",
                desc: "Goals, learning preferences, current progress, and long-term financial vision.",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-slate-800 p-8">
                <p className="text-4xl font-black text-blue-400">{item.label}</p>
                <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scoring */}
        <div className="mt-20 rounded-2xl bg-[#111827] p-10">
          <h2 className="text-4xl font-black">How Scoring Works</h2>
          <p className="mt-6 text-xl leading-9 text-slate-300">
            Each question has four answer choices. Answers are weighted based
            on the level of competency they reflect.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "A", points: "100 pts", desc: "Strongest answer" },
              { label: "B", points: "75 pts", desc: "Strong answer" },
              { label: "C", points: "50 pts", desc: "Developing answer" },
              { label: "D", points: "25 pts", desc: "Beginning answer" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-700 p-6 text-center"
              >
                <p className="text-4xl font-black text-blue-400">{item.label}</p>
                <p className="mt-3 text-2xl font-bold">{item.points}</p>
                <p className="mt-2 text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xl leading-9 text-slate-300">
            Each section score is the average of its four question scores.
            The overall Financial Competency Score is the average across all
            six sections, expressed as a percentage from 0 to 100.
          </p>
        </div>

        {/* Competency Levels */}
        <div className="mt-20 rounded-2xl bg-slate-900 p-10">
          <h2 className="text-4xl font-black">Competency Levels</h2>
          <div className="mt-10 space-y-4">
            {[
              { range: "95–100", level: "Master", color: "text-green-400", desc: "Exceptional command of financial principles and real-world application." },
              { range: "85–94", level: "Advanced", color: "text-blue-400", desc: "Strong financial competency with consistent disciplined action." },
              { range: "70–84", level: "Proficient", color: "text-blue-300", desc: "Good foundation with clear areas for further development." },
              { range: "55–69", level: "Developing", color: "text-yellow-400", desc: "Basic understanding established; structured learning recommended." },
              { range: "40–54", level: "Foundational", color: "text-orange-400", desc: "Early-stage competency; focus on core financial principles." },
              { range: "0–39", level: "Beginning", color: "text-red-400", desc: "Starting point — everyone begins here. The journey starts now." },
            ].map((item) => (
              <div
                key={item.level}
                className="flex items-start gap-6 rounded-xl bg-slate-800 p-6"
              >
                <div className="min-w-[100px] text-right">
                  <p className={`text-2xl font-black ${item.color}`}>{item.level}</p>
                  <p className="text-sm text-slate-500">{item.range}%</p>
                </div>
                <p className="text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What You Receive */}
        <div className="mt-20 rounded-2xl border border-blue-600 bg-[#111827] p-10">
          <h2 className="text-4xl font-black">What You Receive</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              { title: "Overall Score", desc: "A single Financial Competency Score from 0 to 100." },
              { title: "Category Scores", desc: "Individual scores across all six competency areas." },
              { title: "Competency Level", desc: "Your current level from Beginning to Master." },
              { title: "Personalized Roadmap", desc: "A prioritized learning path based on your weakest areas." },
              { title: "Course Recommendations", desc: "Specific Edunancial courses matched to your score profile." },
              { title: "Certificates", desc: "Earn certificates in any area where you score 80% or higher." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="mt-1 text-green-400">✓</span>
                <div>
                  <p className="text-xl font-bold">{item.title}</p>
                  <p className="mt-1 text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 flex flex-wrap justify-center gap-6">
          <Link
            href="/assessment/start"
            className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
          >
            Begin Assessment
          </Link>
          <Link
            href="/assessment/sample-report"
            className="rounded-xl border border-green-500 px-10 py-5 text-xl font-bold hover:bg-green-600"
          >
            View Sample Report
          </Link>
          <Link
            href="/assessment"
            className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
          >
            Back to Overview
          </Link>
        </div>

      </section>
    </main>
  );
}
