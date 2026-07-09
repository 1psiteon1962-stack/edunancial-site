import Link from "next/link";

const steps = [
  "Take the financial competency assessment.",
  "Choose the membership level that matches your goals.",
  "Begin the Red, White, and Blue learning paths.",
  "Use tools and checklists to apply each lesson.",
];

export const metadata = {
  title: "Start With Edunancial | Financial Competency Assessment",
  description:
    "Start with Edunancial by taking the financial competency assessment and choosing a membership path.",
};

export default function StartPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">Start Here</p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Your first step is understanding where you are now.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial starts with assessment, then guides members toward practical education, better decisions, and measurable competency.
        </p>
        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step} className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <span className="text-4xl font-black text-blue-400">{index + 1}</span>
              <p className="mt-4 text-lg font-bold leading-8">{step}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/assessment" className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700">
            Take Assessment
          </Link>
          <Link href="/membership" className="rounded-xl border border-white/60 px-8 py-4 text-lg font-bold hover:bg-white hover:text-slate-950">
            View Membership
          </Link>
        </div>
      </section>
    </main>
  );
}
