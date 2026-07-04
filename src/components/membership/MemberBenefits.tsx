import React from "react";

const benefits = [
  {
    title: "Financial Competency Assessment",
    description:
      "Know exactly where you stand and receive a personalized roadmap for improving your financial competency.",
  },
  {
    title: "Personal Dashboard",
    description:
      "Track your progress, competency score, completed courses, achievements, and learning milestones.",
  },
  {
    title: "Course Library",
    description:
      "Access courses across RED, WHITE, and BLUE: real estate, paper assets, and business.",
  },
  {
    title: "Downloadable Resources",
    description:
      "Worksheets, calculators, checklists, templates, and guides you can use on your phone or computer.",
  },
  {
    title: "Certificates",
    description:
      "Earn certificates as you complete learning paths and competency milestones.",
  },
  {
    title: "Professional Marketplace",
    description:
      "Connect with attorneys, accountants, lenders, business advisors, insurance professionals, and financial coaches.",
  },
  {
    title: "AI Financial Coach",
    description:
      "Receive personalized educational guidance based on your competency level, goals, and progress.",
  },
  {
    title: "Family Learning",
    description:
      "Use the platform to help children, teens, parents, and families learn together.",
  },
  {
    title: "Business KPI Tools",
    description:
      "Access tools for pricing, profit, cash flow, KPIs, and business decision-making.",
  },
  {
    title: "Global Access",
    description:
      "Membership is designed for North America first, with expansion into Africa, Latin America, the Caribbean, Europe, and Asia.",
  },
  {
    title: "Member Bonuses",
    description:
      "Receive access to future guides, webinars, templates, reports, and early platform features.",
  },
  {
    title: "Continuous Improvement",
    description:
      "Financial competency is not a one-time lesson. It is a lifelong process of learning, practicing, measuring, and improving.",
  },
];

export default function MemberBenefits() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Membership Benefits
        </p>

        <h2 className="mt-4 text-4xl font-bold md:text-5xl">
          Everything Included With Membership
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Membership is designed to help you move beyond financial literacy.
          The goal is to build financial competency through education,
          practice, measurement, and disciplined action.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 p-8 transition hover:border-blue-500"
          >
            <h3 className="text-xl font-bold text-white">
              {benefit.title}
            </h3>

            <p className="mt-4 leading-7 text-slate-300">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
