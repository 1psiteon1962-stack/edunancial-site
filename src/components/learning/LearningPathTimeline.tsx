const stages = [
  {
    title: "Foundations",
    description:
      "Develop the mindset, habits, and discipline required before building wealth.",
  },
  {
    title: "Financial Literacy",
    description:
      "Understand money, budgeting, investing, credit, and financial terminology.",
  },
  {
    title: "Financial Competency",
    description:
      "Apply financial knowledge through measurable decisions and real-world practice.",
  },
  {
    title: "Entrepreneurship",
    description:
      "Identify problems, validate demand, build solutions, and measure results.",
  },
  {
    title: "Business Operations",
    description:
      "Operate profitable businesses using KPIs, cash flow, systems, and management.",
  },
  {
    title: "Business Scaling",
    description:
      "Grow responsibly using data, delegation, automation, and AI.",
  },
  {
    title: "Executive Leadership",
    description:
      "Lead organizations through strategic thinking and disciplined decision-making.",
  },
  {
    title: "Wealth Building",
    description:
      "Create long-term wealth through businesses, investments, and asset ownership.",
  },
];

export default function LearningPathTimeline() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-5xl font-black">
          Your Complete Journey
        </h2>

        <div className="mt-16 space-y-8">
          {stages.map((stage, index) => (
            <div
              key={stage.title}
              className="rounded-xl bg-slate-900 p-8"
            >
              <div className="text-yellow-400 font-bold">
                Stage {index + 1}
              </div>

              <h3 className="mt-2 text-3xl font-bold">
                {stage.title}
              </h3>

              <p className="mt-4 text-slate-300">
                {stage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
