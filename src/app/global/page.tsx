import GlobalPreferenceSummary from "@/components/global-rollout/GlobalPreferenceSummary";

export const metadata = {
  title: "Global Experience | Edunancial",
};

export default function GlobalPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-300">
          Global experience
        </p>
        <h1 className="mt-4 text-5xl font-black">Market, language, and currency controls</h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
          Edunancial now resolves region, country, language, currency, compliance, and feature availability from a shared rollout architecture instead of route-by-route market hard-coding.
        </p>

        <div className="mt-10">
          <GlobalPreferenceSummary />
        </div>
      </section>
    </main>
  );
}
