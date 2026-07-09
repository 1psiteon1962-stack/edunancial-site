import Link from "next/link";

const launchPriorities = [
  "Financial literacy that turns into financial competency",
  "Clear Red, White, and Blue learning paths",
  "Membership-first experience built for recurring revenue",
  "Practical tools for households, investors, and entrepreneurs",
];

export const metadata = {
  title: "Edunancial North America | Financial Competency Platform",
  description:
    "Edunancial North America helps members build financial competency through real estate, paper assets, and business education.",
};

export default function NorthAmericaPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          North America Launch
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Learn money. Practice decisions. Build financial competency.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Edunancial is being built to help North American members move beyond basic financial literacy into disciplined action across real estate, paper assets, and business.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/membership" className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700">
            Become a Member
          </Link>
          <Link href="/assessment" className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-slate-950">
            Start Assessment
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-950/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-4">
          {launchPriorities.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-lg font-bold leading-8">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
