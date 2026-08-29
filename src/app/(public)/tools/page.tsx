import Link from "next/link";

export const metadata = {
  title: "Interactive Tools | Edunancial",
  description: "Applied financial tools for Edunancial members.",
};

const tools = [
  {
    name: "Investment Growth Calculator",
    description:
      "Model recurring contributions, expected returns, and compound growth over time with your own assumptions.",
    href: "/tools/investment-growth",
    access: "Level 2+",
  },
] as const;

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-14">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/courses" className="hover:text-white">Courses</Link>
          <span>/</span>
          <span className="text-slate-200">Interactive Tools</span>
        </nav>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Edunancial member tools</p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">Put the lessons to work.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
          Use these interactive tools to test assumptions, compare scenarios, and apply Edunancial concepts to your own financial decisions. Access follows the curriculum level attached to each tool.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {tools.map((tool) => (
            <article key={tool.href} className="rounded-3xl border border-white/10 bg-slate-950/50 p-7">
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-300">{tool.access}</span>
              <h2 className="mt-5 text-2xl font-black">{tool.name}</h2>
              <p className="mt-3 leading-7 text-slate-300">{tool.description}</p>
              <Link href={tool.href} className="mt-6 inline-flex rounded-xl bg-yellow-500 px-5 py-3 font-black text-black hover:bg-yellow-400">Open tool</Link>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-slate-400">
          These tools are educational illustrations. Results depend on the assumptions you enter and are not guarantees of investment performance, tax treatment, or financial outcomes.
        </div>
      </section>
    </main>
  );
}
