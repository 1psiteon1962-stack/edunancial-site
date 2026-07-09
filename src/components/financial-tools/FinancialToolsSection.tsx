import BudgetCalculator from "./BudgetCalculator";
import ToolCard from "./ToolCard";

const tools = [
  {
    name: "Budget Calculator",
    description: "Plan monthly income, expenses, savings, and debt payments.",
    status: "Available" as const,
    ctaLabel: "Use Tool",
    icon: "📊",
    ctaHref: "#budget-calculator",
  },
  {
    name: "Debt Payoff Planner",
    description: "Compare snowball, avalanche, and custom payoff strategies.",
    status: "Coming Soon" as const,
    ctaLabel: "Coming Soon",
    icon: "🧾",
  },
  {
    name: "Emergency Fund Planner",
    description: "Calculate how much cash reserve a household should maintain.",
    status: "Coming Soon" as const,
    ctaLabel: "Coming Soon",
    icon: "🛟",
  },
  {
    name: "Retirement Calculator",
    description:
      "Estimate retirement savings needs based on age, income, contributions, and goals.",
    status: "Coming Soon" as const,
    ctaLabel: "Coming Soon",
    icon: "🏖️",
  },
  {
    name: "Mortgage Calculator",
    description: "Estimate monthly mortgage payment, taxes, insurance, and total cost.",
    status: "Coming Soon" as const,
    ctaLabel: "Coming Soon",
    icon: "🏠",
  },
  {
    name: "Investment Growth Calculator",
    description:
      "Project compound growth over time using contributions and estimated returns.",
    status: "Coming Soon" as const,
    ctaLabel: "Coming Soon",
    icon: "📈",
  },
  {
    name: "Net Worth Tracker",
    description: "Track assets, liabilities, and financial progress over time.",
    status: "Coming Soon" as const,
    ctaLabel: "Coming Soon",
    icon: "🧮",
  },
  {
    name: "Credit Improvement Planner",
    description:
      "Help users understand credit utilization, payment history, and improvement goals.",
    status: "Coming Soon" as const,
    ctaLabel: "Coming Soon",
    icon: "✅",
  },
];

export default function FinancialToolsSection() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <p className="font-bold uppercase tracking-[0.4em] text-yellow-400">Financial Tools</p>
        <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
          Financial Tools That Help You Take Action
        </h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-200">
          Learning is powerful. Applying what you learn is where financial competence begins.
        </p>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
          Edunancial tools are designed to help members plan, compare, calculate, and make better
          financial decisions.
        </p>
        <p className="mt-6 max-w-5xl text-base leading-7 text-slate-300">
          Explore financial calculators and practical financial literacy tools built as financial
          education tools. This first release includes a working budget calculator, plus upcoming
          experiences like a debt payoff planner and retirement calculator.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard
              key={tool.name}
              name={tool.name}
              description={tool.description}
              status={tool.status}
              ctaLabel={tool.ctaLabel}
              icon={tool.icon}
              ctaHref={tool.ctaHref}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:pb-24">
        <BudgetCalculator />
      </section>
    </main>
  );
}
